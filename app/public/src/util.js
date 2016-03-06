var cryptoSha3 = require('crypto-js/sha3');
var ethUtil = require('ethereumjs-util');

function isPkey(str) {
  return /^0x[\dabcdef]{64}$/.test(str);
}

function sha3(str) {
  return '0x' + cryptoSha3(str, { outputLength: 256 }).toString();
}

function toAddress(pkey) {
  return '0x' + ethUtil.privateToAddress(new Buffer(pkey.substr(2), 'hex')).toString('hex');
}

function waitForReceipt(web3, txHash, cb) {
  var blockFilter = web3.eth.filter('latest');
  blockFilter.watch(function() {
    web3.eth.getTransactionReceipt(txHash, function(err, receipt) {
      if (err) return cb(err);
      if (receipt) {
        blockFilter.stopWatching();
        cb(null, receipt);
      }
    });
  });
}

function fold(val) {
  return val.substr(0, 6) + '...' + val.substr(-4);
}

module.exports = {
  isPkey: isPkey,
  sha3: sha3,
  toAddress: toAddress,
  waitForReceipt: waitForReceipt,
  fold: fold
};