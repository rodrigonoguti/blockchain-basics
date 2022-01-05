const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const Blockchain = require('./blockchain');

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

app.listen(3000, function () {
  console.log('Listening on port 3000...');
});