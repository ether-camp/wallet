var assert = require('assert');
var _ = require('lodash');
var Workbench = require('ethereum-sandbox-workbench');

var workbench = new Workbench({
  defaults: {
    from: '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392'
  }
});

workbench.startTesting('wallet', function(contracts) {
  var sandbox = workbench.sandbox;
  var owner1 = '0xcc49bea5129ef2369ff81b0c0200885893979b77';
  var owner2 = '0x211b1b6e61e475ace9bf13ae79373ddb419b5f72';
  var recipient = '0x133749385ad5b94a16f236a6890cf9e0b1e30392';
  var wallet;
  var multisigTxHash;

  it('Deploy', function() {
    return contracts.Wallet.new(
      [owner1, owner2],
      2,
      10000
    ).then(function(contract) {
      if (contract.address) {
        wallet = contract;
      } else {
        throw new Error('Contract has not been deployed');
      }
      return true;
    });
  });
  
  it('Top up', function() {
    var sum = 1000000;
    
    return workbench.sendTransaction({
      from: owner1,
      to: wallet.address,
      value: sum
    })
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      })
      .then(function(receipt) {
        assert.equal(sandbox.web3.eth.getBalance(wallet.address), sum);
        return true;
      });
  });
  
  it('Send below the daily limit', function() {
    var sum = 1000;
    var balanceBefore = sandbox.web3.eth.getBalance(wallet.address).toNumber();
    var recipientBalanceBefore = sandbox.web3.eth.getBalance(recipient).toNumber();
    return wallet.execute(recipient, sum, null, { from: owner1 })
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      })
      .then(function(receipt) {
        assert(_.find(receipt.logs, { event: 'SingleTransact' }));
        var balanceAfter = sandbox.web3.eth.getBalance(wallet.address).toNumber();
        assert.equal(balanceBefore - balanceAfter, sum);
        var recipientBalanceAfter = sandbox.web3.eth.getBalance(recipient).toNumber();
        assert.equal(recipientBalanceAfter - recipientBalanceBefore, sum);
        return true;
      });
  });
  
  var multisigSum = 100000;
  
  it('Send above the daily limit', function() {
    return wallet.execute(recipient, multisigSum, null, { from: owner1 })
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      })
      .then(function(receipt) {
        assert(_.find(receipt.logs, { event: 'Confirmation' }));
        assert(_.find(receipt.logs, { event: 'ConfirmationNeeded' }));
        multisigTxHash = _.find(receipt.logs, { event: 'ConfirmationNeeded' }).args.operation;
        return true;
      });
  });
  
  it('Confirm multisig tx', function() {
    var balanceBefore = sandbox.web3.eth.getBalance(wallet.address).toNumber();
    var recipientBalanceBefore = sandbox.web3.eth.getBalance(recipient).toNumber();
    return wallet.confirm(multisigTxHash, { from: owner2 })
      .then(function(txHash) {
        return workbench.waitForReceipt(txHash);
      })
      .then(function(receipt) {
        assert(_.find(receipt.logs, { event: 'Confirmation' }));
        assert(_.find(receipt.logs, { event: 'MultiTransact' }));
        var balanceAfter = sandbox.web3.eth.getBalance(wallet.address).toNumber();
        assert.equal(balanceBefore - balanceAfter, multisigSum);
        var recipientBalanceAfter = sandbox.web3.eth.getBalance(recipient).toNumber();
        assert.equal(recipientBalanceAfter - recipientBalanceBefore, multisigSum);
        return true;
      });
  });
});