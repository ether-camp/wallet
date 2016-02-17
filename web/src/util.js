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

module.exports = {
  isPkey: isPkey,
  sha3: sha3,
  toAddress: toAddress
};