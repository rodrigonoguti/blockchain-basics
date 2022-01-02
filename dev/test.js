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
const previousBlockHash = 'DAKSLJFKJAFJKA89231293';
const currentBlockData = [
  {
    amount: 10,
    sender: 'ALEX4324DJKLFSJIJ',
    recipient: 'JENKAJKAJSK99039'
  },
  {
    amount: 20,
    sender: 'DAKSLJFKJAFJKA89231293',
    recipient: 'WIAJKLJFL28901839'
  },
  {
    amount: 30,
    sender: 'WKSAJFIWJSKF39293828',
    recipient: 'SKEIJDK939230'
  }
];
const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
const hashBlockResult = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
console.log(nonce);
console.log(hashBlockResult);