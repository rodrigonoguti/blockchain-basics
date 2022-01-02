const sha256 = require('sha256');

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

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
 * Create new transaction and push it to pending transactions array
 * @param {amount} amount amount of money
 * @param {string} sender sender address
 * @param {string} recipient recipient address
 * @returns index of the last block
 */
Blockchain.prototype.createNewTransation = function (amount, sender, recipient) {
  const newTransaction = {
    amount,
    sender,
    recipient,
  };

  // Push the new transaction to the transactions array
  this.pendingTransactions.push(newTransaction);

  return this.getLastBlock()['index'];
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

module.exports = Blockchain;