var async = require('async');
var _ = require('lodash');
var SolidityFunction = require('web3/lib/web3/function');
var ethTx = require('ethereumjs-tx');
var util = require('../util');

var abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "getOwners",
    "outputs": [
      {
        "name": "",
        "type": "uint256[256]"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_h",
        "type": "bytes32"
      }
    ],
    "name": "confirm",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "execute",
    "outputs": [
      {
        "name": "_r",
        "type": "bytes32"
      }
    ],
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "operation",
        "type": "bytes32"
      }
    ],
    "name": "Confirmation",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "SingleTransact",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "operation",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "MultiTransact",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "operation",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "name": "initiator",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "ConfirmationNeeded",
    "type": "event"
  }
];

var wallet = {
  init: function(app, address) {
    this.app = app;
    this.address = address;
    this.contract = app.web3.eth.contract(abi).at(address);
    return this;
  },
  execute: function(to, value, pkey, cbSent, cbMined) {
    var func = new SolidityFunction(this.app.web3, _.find(abi, { name: 'execute' }), '');
    var data = func.toPayload([to, value, '']).data;
    
    var address = util.toAddress(pkey);
    
    async.parallel({
      nonce: this.app.web3.eth.getTransactionCount.bind(this.app.web3.eth, address),
      gasPrice: this.app.web3.eth.getGasPrice.bind(this.app.web3.eth)
    }, (function(err, results) {
      if (err) return cbSent(err);
      
      var tx = new ethTx({
        to: this.address,
        nonce: results.nonce,
        gasLimit: '0x100000',
        gasPrice: '0x' + results.gasPrice.toString(16),
        data: data
      });
      tx.sign(new Buffer(pkey.substr(2), 'hex'));
      
      this.app.web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), (function(err, txHash) {
        if (err) return cbSent(err);
        cbSent(null, txHash);
        util.waitForReceipt(this.app.web3, txHash, cbMined);
      }).bind(this));
    }).bind(this));
  },
  confirm: function(id, pkey, cbSent, cbMined) {
    var func = new SolidityFunction(this.app.web3, _.find(abi, { name: 'confirm' }), '');
    var data = func.toPayload([id]).data;
    
    var address = util.toAddress(pkey);
      
    async.parallel({
      nonce: this.app.web3.eth.getTransactionCount.bind(this.app.web3.eth, address),
      gasPrice: this.app.web3.eth.getGasPrice.bind(this.app.web3.eth)
    }, (function(err, results) {
      if (err) return cbSent(err);
      
      var tx = new ethTx({
        to: this.address,
        nonce: results.nonce,
        gasLimit: '0x100000',
        gasPrice: '0x' + results.gasPrice.toString(16),
        data: data
      });
      tx.sign(new Buffer(pkey.substr(2), 'hex'));
      
      this.app.web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), (function(err, txHash) {
        if (err) return cbSent(err);
        cbSent(null, txHash);
        util.waitForReceipt(this.app.web3, txHash, cbMined);
      }).bind(this));
    }).bind(this));
  }
};

module.exports = wallet;