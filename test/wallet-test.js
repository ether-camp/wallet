var assert = require('assert');
var Compiler = require('solidity-compiler');
var Sandbox = require('ethereum-sandbox-client');

describe('Contract', function() {
  this.timeout(60000);
  
  var compiler = new Compiler('contracts');
  var sandbox = new Sandbox('http://localhost:8555');
  var contract;
  
  before(function(done) {
    sandbox.start(function(err) {
      if (err) return done(err);
      
      compiler.compile('wallet.sol', function(err, compiled) {
        if (err) return done(err);

        var wallet = compiled[0];
        contract = sandbox.web3.eth.contract(wallet.abi).new(
          [ '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826' ],
          2,
          10000,
          {
            data: '0x' + wallet.binary
          },
          function(err, created) {
            if (err) return done(err);
            if (created.address) done();
          }
        );
      });
    });
  });
  
  it('prints string', function (done) {


    done();
  });
  
  after(function(done) {
    sandbox.stop(function(err) {
      done(err);
    });
  });
});

function toString(hex) {
  return String.fromCharCode.apply(
    null,
    toArray(removeTrailingZeroes(hex.substr(2)))
  );
}

function removeTrailingZeroes(str) {
  if (str.length % 2 !== 0)
    console.error('Wrong hex str: ' + str);
  
  var lastNonZeroByte = 0;
  for (var i = str.length - 2; i >= 2; i -= 2) {
    if (str.charAt(i) !== '0' || str.charAt(i + 1) !== '0') {
      lastNonZeroByte = i;
      break;
    }
  }
  
  return str.substr(0, lastNonZeroByte + 2);
}

function toArray(str) {
  if (str.length % 2 !== 0)
    console.error('Wrong hex str: ' + str);
  
  var arr = [];
  for (var i = 0; i < str.length; i += 2) {
    var code = parseInt(str.charAt(i) + str.charAt(i + 1), 16);
    // Ignore non-printable characters
    if (code > 9) arr.push(code);
  }
  
  return arr;
}