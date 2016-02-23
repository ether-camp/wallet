var EventEmitter = require('events');
var ethTx = require('ethereumjs-tx');
var _ = require('lodash');
var Web3 = require('web3');

var NameReg = require('./contracts/name-reg');
var Wallet = require('./contracts/wallet');
var SelectAccountDialog = require('./ui/select-account-dialog');
var SendTxDialog = require('./ui/send-tx-dialog');
var TopUpDialog = require('./ui/top-up-dialog');
var HeaderWidget = require('./ui/header');
var WalletWidget = require('./ui/wallet');

var sandboxId = '3d2cab8c33';
var url = 'http://alex2.on.my.ether.camp:8555/sandbox/' + sandboxId;
//var url = 'http://peer-1.ether.camp:8082';
//var nameRegAddress = '0x084f6a99003dae6d3906664fdbf43dd09930d0e3';
var nameRegAddress = '0x0860a8008298322a142c09b528207acb5ab7effc'; // testnet

var app = new EventEmitter();
app.web3 = new Web3(new Web3.providers.HttpProvider(url));
app.nameReg = NameReg.create(app.web3, nameRegAddress);

$(function() {
  var selectAccountDialog = Object.create(SelectAccountDialog).init(app, $('#selectAccountDialog'));
  var sendTxDialog = Object.create(SendTxDialog).init(app, $('#sendTxDialog'));
  var topUpDialog = Object.create(TopUpDialog).init(app, $('#topUpDialog'));
  
  Object.create(HeaderWidget).init(app, $('#header'), selectAccountDialog);
  Object.create(WalletWidget).init(app, $('#wallet'), topUpDialog, sendTxDialog);
  
  selectAccountDialog.show();

  app.on('accountSelected', function() {
    app.nameReg.addressOf('Wallet', function(err, address) {
      if (err) return console.error(err);
      app.wallet = Object.create(Wallet).init(app, address);
      app.emit('walletLoaded');
    });
  });
});