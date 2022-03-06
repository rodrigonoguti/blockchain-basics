const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const Blockchain = require('./blockchain');
const port = process.argv[2];
const requestPromise = require('request-promise');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// create blockchain node identifier
const nodeAddress = uuid().split('-').join('');

// create instance of blockchain
const bitcoin = new Blockchain();

// return the whole blockchain
app.get('/blockchain', function (req, res) {
  res.send(bitcoin);
});

// add a new transaction to pending transactions list
app.post('/transaction', function (req, res) {
  const newTransaction = req.body;
  const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// create and broadcast a new transaction
app.post('/transaction/broadcast', function (req, res) {
  const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  bitcoin.addTransactionToPendingTransactions(newTransaction);

  // broadcast to other nodes
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/transaction',
      method: 'post',
      body: newTransaction,
      json: true,
    }

    requestPromises.push(requestPromise(requestOptions));
  });

  Promise.all(requestPromises)
    .then(data => {
      res.json({ note: 'Transaction created and brodcast successfully' });
    });
});

// mine/create a new block
app.get('/mine', function (req, res) {
  // get previous block data
  const lastBlock = bitcoin.getLastBlock();
  const previousBlockHash = lastBlock.hash;

  // current block
  const currentBlockData = {
    transactions: bitcoin.pendingTransactions,
    index: lastBlock.index + 1,
  };

  // get nonce
  const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

  // get block hash
  const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

  // create new block
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  // broadcast new block to other nodes
  const requestPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/receive-new-block',
      method: 'POST',
      body: { newBlock },
      json: true,
    };

    requestPromises.push(requestPromise(requestOptions));
  });

  Promise.all(requestPromises)
    .then(data => {

      // give mining reward to the user
      const requestOptions = {
        uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
        method: 'POST',
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress,
        },
        json: true,
      };

      return requestPromise(requestOptions);
    })
    .then(data => {
      res.json({
        note: "New block mined & broadcast successfully",
        block: newBlock
      });
    });
});

// receive a new block from broadcast
app.post('/receive-new-block', function (req, res) {
  const newBlock = req.body.newBlock;

  // check if previous block hash (in new block) is equal to the last block hash in this node
  const lastBlock = bitcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

  if (correctHash && correctIndex) {
    bitcoin.chain.push(newBlock);
    bitcoin.pendingTransactions = [];
    res.json({
      note: 'New block received and accepted.',
      newBlock,
    })
  } else {
    res.json({
      note: 'New block rejected.',
      newBlock,
    });
  }
});

// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;

  // register only if the new node/URL is not already registered
  if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  // broadcast new node to the others nodes
  const regNodesPromises = [];
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'post',
      body: { newNodeUrl },
      json: true,
    };

    regNodesPromises.push(requestPromise(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then(data => {
      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'post',
        body: { allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl] },
        json: true,
      };

      requestPromise(bulkRegisterOptions);
    })
    .then(data => {
      res.json({ note: 'New node registered with network successfully' });
    });
});

// register a node with the network
app.post('/register-node', function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) === -1;
  const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;

  if (nodeNotAlreadyPresent && notCurrentNode) {
    bitcoin.networkNodes.push(newNodeUrl);
  }

  res.json({ note: 'New node registered successfully.' });
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;

  allNetworkNodes.forEach(networkNodeUrl => {
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) === -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode) {
      bitcoin.networkNodes.push(networkNodeUrl);
    }
  });

  res.json({ note: 'Bulk registration successful' });
});

// consensus
app.get('/consensus', function (req, res) {
  const requestPromises = [];

  bitcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/blockchain',
      method: 'GET',
      json: true,
    };

    requestPromises.push(requestPromise(requestOptions));
  });

  Promise.all(requestPromises)
    .then(blockchains => {
      const currentChainLength = bitcoin.chain.length;
      let maxChainLength = currentChainLength;
      let newLongestChain = null;
      let newPendingTransactions = null;

      blockchains.forEach(blockchain => {
        if (blockchain.chain.length > maxChainLength) {
          maxChainLength = blockchain.chain.length;
          newLongestChain = blockchain.chain;
          newPendingTransactions = blockchain.pendingTransactions;
        }
      });

      if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
        res.json({
          note: 'Current chain has not been replaced.',
          chain: bitcoin.chain
        });
      } else {
        bitcoin.chain = newLongestChain;
        bitcoin.pendingTransactions = newPendingTransactions;
        res.json({
          note: 'This chain has been replaced.',
          chain: bitcoin.chain
        });
      }
    })
});

// get block by hash
app.get('/block/:blockHash', function (req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = bitcoin.getBlock(blockHash);

  res.json({ block: correctBlock });
});

// get transaction by id
app.get('/transaction/:transactionId', function (req, res) {
  const transactionId = req.params.transactionId;
  const transactionData = bitcoin.getTransaction(transactionId);

  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block
  });
});

// get data for an specific address
app.get('/address/:address', function (req, res) {

});

app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});