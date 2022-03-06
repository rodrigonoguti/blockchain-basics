const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const { v4: uuid } = require('uuid');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  // Create block genesis using arbitrary values (first block of the block chain)
  this.createNewBlock(100, '0', '0');
}

// Using class instead of constructor function
// class Blockchain {
//   constructor() {
//     this.chain = [];
//     this.pendingTransactions = [];
//   }
// }

// It could be a method in "Blockchain class" notation
/**
 * Create new block and push to chain
 * @param {number} nonce proof of work
 * @param {string} previousBlockHash previous hash before new block
 * @param {string} hash new hash
 * @returns new block object
 */
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce,
    hash,
    previousBlockHash,
  };

  // Clean new transactions 'cause they are going to be part of the chain
  this.pendingTransactions = [];

  // Push the new block to the chain
  this.chain.push(newBlock);

  return newBlock;
}

/**
 * Returns last created block
 * @returns last block object
 */
Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
}

/**
 * Create new transaction object
 * @param {amount} amount amount of money
 * @param {string} sender sender address
 * @param {string} recipient recipient address
 * @returns transaction object
 */
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
  const newTransaction = {
    amount,
    sender,
    recipient,
    transactionId: uuid().split('-').join(''),
  };

  return newTransaction;
}

/**
 * Add transaction to pending transactions list
 * @param {*} transactionObj 
 * @returns returns the index of the transaction
 */
Blockchain.prototype.addTransactionToPendingTransactions = function (transactionObj) {
  // Push the new transaction to the transactions array
  this.pendingTransactions.push(transactionObj);

  return this.getLastBlock()['index'] + 1;
}

/**
 * Create a block hash using SHA256
 * @param {string} previousBlockHash 
 * @param {object} currentBlockData 
 * @param {number} nonce 
 * @returns hash
 */
Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
  const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);

  return hash;
}

/**
 * Proof of work method to find a valid nonce value (valid hash starts with 0000)
 * @param {string} previousBlockHash 
 * @param {object} currentBlockData 
 * @returns returns nonce value found
 */
Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

  // Increase nonce until invalid hash (valid hash starts with '0000')
  while (hash.substring(0, 4) !== '0000') {
    nonce++;
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
  }

  return nonce;
}

/**
 * Check if a blockchain is valid
 * @param {object} blockchain 
 */
Blockchain.prototype.chainIsValid = function (blockchain) {
  let validChain = true;

  // iterate each block to validate
  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const prevBlock = blockchain[i - 1];
    const blockHash = this.hashBlock(
      prevBlock['hash'],
      { transactions: currentBlock['transactions'], index: currentBlock['index'] },
      currentBlock['nonce']
    );

    // check the hash and previous hash
    const chainIsNotValid = currentBlock['previousBlockHash'] !== prevBlock['hash'];

    // check the block data
    const dataIsNotValid = blockHash.substring(0, 4) !== '0000';

    if (chainIsNotValid || dataIsNotValid) {
      validChain = false;
      break;
    }
  }

  // check genesis block
  const genesisBlock = blockchain[0];
  const correctNonce = genesisBlock['nonce'] === 100;
  const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
  const correctHash = genesisBlock['hash'] === '0';
  const correctTransactions = genesisBlock['transactions'].length === 0;

  if (!(correctNonce && correctPreviousBlockHash && correctHash && correctTransactions)) {
    validChain = false;
  }

  return validChain;
}

/**
 * Get a block by its hash
 * @param {string} blockHash 
 * @returns block object
 */
Blockchain.prototype.getBlock = function (blockHash) {
  let correctBlock = null;

  this.chain.forEach(block => {
    if (block.hash === blockHash) {
      correctBlock = block;
    }
  });

  return correctBlock;
}

/**
 * Get a transaction by its id
 * @param {string} transactionId 
 * @returns object with the required transaction and its block
 */
Blockchain.prototype.getTransaction = function (transactionId) {
  let correctTransaction = null;
  let correctBlock = null;

  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.transactionId === transactionId) {
        correctTransaction = transaction;
        correctBlock = block;
      }
    });
  });

  return {
    transaction: correctTransaction,
    block: correctBlock
  };
}

/**
 * Get transactions data for an specific address
 * @param {string} address 
 * @returns object with address transactions list and its balance
 */
Blockchain.prototype.getAddressData = function (address) {
  const addressTransactions = [];

  this.chain.forEach(block => {
    block.transactions.forEach(transaction => {
      if (transaction.sender === address || transaction.recipient === address) {
        addressTransactions.push(transaction);
      }
    })
  });

  let addressBalance = 0;

  addressTransactions.forEach(transaction => {
    if (transaction.recipient === address) {
      addressBalance += transaction.amount;
    } else {
      addressBalance -= transaction.amount;
    }
  });

  return {
    addressTransactions,
    addressBalance
  };
}

module.exports = Blockchain;