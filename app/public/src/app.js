var EventEmitter = require('events');
var Web3 = require('web3');

var NameReg = require('./contracts/name-reg');
var Wallet = require('./contracts/wallet');
var SendTxDialog = require('./ui/send-tx-dialog');
var TopUpDialog = require('./ui/top-up-dialog');
var PkeyDialog = require('./ui/pkey-dialog');
var WalletWidget = require('./ui/wallet');


var url;
if (window.JSON_RPC) url = window.JSON_RPC;
else {
  var sandboxId = '7425ef1b3f';
  url = '//' + window.location.hostname + ':8555/sandbox/' + sandboxId;
}

//var url = 'http://peer-1.ether.camp:8082';
//var nameRegAddress = '0x084f6a99003dae6d3906664fdbf43dd09930d0e3'; // livenet
var nameRegAddress = '0x0860a8008298322a142c09b528207acb5ab7effc'; // testnet
if (window.NAME_REG) nameRegAddress = window.NAME_REG;

var app = new EventEmitter();
app.web3 = new Web3(new Web3.providers.HttpProvider(url));
app.nameReg = NameReg.create(app.web3, nameRegAddress);

$(function() {
  var sendTxDialog = Object.create(SendTxDialog).init(app, $('#sendTxDialog'));
  var topUpDialog = Object.create(TopUpDialog).init(app, $('#topUpDialog'));
  var pkeyDialog = Object.create(PkeyDialog).init($('#pkeyDialog'));
  
  Object.create(WalletWidget).init(app, $('#wallet'), topUpDialog, sendTxDialog, pkeyDialog);
  
  app.nameReg.addressOf('Wallet', function(err, address) {
    if (err) return console.error(err);
    app.wallet = Object.create(Wallet).init(app, address);
    app.emit('walletLoaded');
  });
});