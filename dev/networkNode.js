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

// create a new transaction
app.post('/transaction', function (req, res) {
  const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
  res.json({ note: `Transaction will be added in block ${blockIndex}.` });
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

  // give mining reward to the user
  bitcoin.createNewTransaction(12.5, "00", nodeAddress);

  // create new block
  const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  res.json({
    note: "New block mined successfully",
    block: newBlock
  });
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

app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});