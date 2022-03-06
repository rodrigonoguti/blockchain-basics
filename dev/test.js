const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

// Testing createNewBlock()
// bitcoin.createNewBlock(2389, 'DAKSLJFKJAFJKA89231293', 'WIAJKLJFL28901839');
// bitcoin.createNewBlock(1111, 'WKSAJFIWJSKF39293828', 'SKEIJDK939230');
// bitcoin.createNewBlock(2222, 'CVFJKDJFKJE382434879', 'IORIOWKJSKF3389789478');
// console.log(bitcoin);

// Testing createNewTransaction()
// bitcoin.createNewBlock(2389, 'DAKSLJFKJAFJKA89231293', 'WIAJKLJFL28901839');
// bitcoin.createNewTransation(100, 'ALEX4324DJKLFSJIJ', 'JENKAJKAJSK99039');
// bitcoin.createNewBlock(1111, 'WKSAJFIWJSKF39293828', 'SKEIJDK939230');
// console.log(bitcoin);

// Testing hashBlock()
// const previousBlockHash = 'DAKSLJFKJAFJKA89231293';
// const nonce = 100;
// const currentBlockData = [
//   {
//     amount: 10,
//     sender: 'ALEX4324DJKLFSJIJ',
//     recipient: 'JENKAJKAJSK99039'
//   },
//   {
//     amount: 20,
//     sender: 'DAKSLJFKJAFJKA89231293',
//     recipient: 'WIAJKLJFL28901839'
//   },
//   {
//     amount: 30,
//     sender: 'WKSAJFIWJSKF39293828',
//     recipient: 'SKEIJDK939230'
//   }
// ];
// const hashBlockResult = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
// console.log(hashBlockResult);

// Testing proofOfWork()
// const previousBlockHash = 'DAKSLJFKJAFJKA89231293';
// const currentBlockData = [
//   {
//     amount: 10,
//     sender: 'ALEX4324DJKLFSJIJ',
//     recipient: 'JENKAJKAJSK99039'
//   },
//   {
//     amount: 20,
//     sender: 'DAKSLJFKJAFJKA89231293',
//     recipient: 'WIAJKLJFL28901839'
//   },
//   {
//     amount: 30,
//     sender: 'WKSAJFIWJSKF39293828',
//     recipient: 'SKEIJDK939230'
//   }
// ];
// const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
// const hashBlockResult = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
// console.log(nonce);
// console.log(hashBlockResult);

// Testing chainIsValid()
const blockchain1 = {
  "chain": [
    {
      "index": 1,
      "timestamp": 1646248981192,
      "transactions": [],
      "nonce": 100,
      "hash": "0",
      "previousBlockHash": "0"
    },
    {
      "index": 2,
      "timestamp": 1646249012981,
      "transactions": [],
      "nonce": 18140,
      "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      "previousBlockHash": "0"
    },
    {
      "index": 3,
      "timestamp": 1646249046095,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recipient": "ec1c8c13fb5b4024b2212bd087d6f001",
          "transactionId": "b001cc952b2f4e20aea5ddf8ae4a2699"
        },
        {
          "amount": 10,
          "sender": "AAAA",
          "recipient": "BBBB",
          "transactionId": "c6c04f5c62ba4aeda631f94b7c1c923e"
        },
        {
          "amount": 20,
          "sender": "AAAA",
          "recipient": "BBBB",
          "transactionId": "024caee1e6ae4c6191eb113502c6058f"
        },
        {
          "amount": 30,
          "sender": "AAAA",
          "recipient": "BBBB",
          "transactionId": "76039cba80fd48abab42755a30d0bc00"
        }
      ],
      "nonce": 1929,
      "hash": "0000ec459765d32ad86e4321d7d70040f1a082f11e98fb446ed34dd0d4e9b392",
      "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
      "index": 4,
      "timestamp": 1646249072209,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recipient": "ec1c8c13fb5b4024b2212bd087d6f001",
          "transactionId": "fd1366d5ec89416b8f68762572e596a5"
        },
        {
          "amount": 40,
          "sender": "AAAA",
          "recipient": "BBBB",
          "transactionId": "230c4386b640411381b207136d8cc4bb"
        },
        {
          "amount": 50,
          "sender": "AAAA",
          "recipient": "BBBB",
          "transactionId": "d5d11f5eb4174cf88b9b96b228b5f018"
        },
        {
          "amount": 60,
          "sender": "AAAA",
          "recipient": "BBBB",
          "transactionId": "ef959fbaafdd47548e9c1cce4ea34510"
        },
        {
          "amount": 70,
          "sender": "AAAA",
          "recipient": "BBBB",
          "transactionId": "919de56e82924bc18ae5d991c854c7d0"
        }
      ],
      "nonce": 114010,
      "hash": "00003553ad9768cbcb317b266d79438bd50152dcf35f416cc19a8a86ca8c2918",
      "previousBlockHash": "0000ec459765d32ad86e4321d7d70040f1a082f11e98fb446ed34dd0d4e9b392"
    },
    {
      "index": 5,
      "timestamp": 1646249084684,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recipient": "ec1c8c13fb5b4024b2212bd087d6f001",
          "transactionId": "6a34e9176a274e2f86eb9ce32f3683da"
        }
      ],
      "nonce": 53435,
      "hash": "0000cee92bdb578fd1a242c40517d65263799616eeb80865607c7298fbbd7034",
      "previousBlockHash": "00003553ad9768cbcb317b266d79438bd50152dcf35f416cc19a8a86ca8c2918"
    },
    {
      "index": 6,
      "timestamp": 1646249085333,
      "transactions": [
        {
          "amount": 12.5,
          "sender": "00",
          "recipient": "ec1c8c13fb5b4024b2212bd087d6f001",
          "transactionId": "b0624ab74b164405a0710f4f7ea799be"
        }
      ],
      "nonce": 5113,
      "hash": "0000a787e92a2e146f9d57464af30aa757cae2d9ca8a117d9b6d086987aff0b4",
      "previousBlockHash": "0000cee92bdb578fd1a242c40517d65263799616eeb80865607c7298fbbd7034"
    }
  ],
  "pendingTransactions": [
    {
      "amount": 12.5,
      "sender": "00",
      "recipient": "ec1c8c13fb5b4024b2212bd087d6f001",
      "transactionId": "9f932058a36c4f799e3a953608648b41"
    }
  ],
  "currentNodeUrl": "http://localhost:3001",
  "networkNodes": []
};
console.log('VALID: ', bitcoin.chainIsValid(blockchain1.chain));