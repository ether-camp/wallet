var _ = require('lodash');
var util = require('../util');

var wallet = {
  init: function(app, $el, topUpDialog, sendTxDialog, pkeyDialog) {
    this.app = app;
    
    this.$address = $el.find('#walletAddress');
    this.$balance = $el.find('#walletBalance');
    this.$topUpBtn = $el.find('#topUpBtn');
    this.$sendTxBtn = $el.find('#sendTxBtn');
    this.$owners = $el.find('#walletOwners');
    this.$txsToConfirm = $el.find('#txsToConfirm');
    this.$events = $el.find('#walletEvents');

    this.$topUpBtn.click(topUpDialog.show.bind(topUpDialog));
    this.$sendTxBtn.click(sendTxDialog.show.bind(sendTxDialog));
    this.$txsToConfirm.click(this.confirm.bind(this, pkeyDialog));

    if (app.account) this.update();
    else app.once('walletLoaded', this.load.bind(this));
    
    app.on('walletUpdated', this.update.bind(this));
    
    return this;
  },
  load: function() {
    this.app.wallet.contract.SingleTransact((function(err, details) {
      if (err) return console.error(err);
      var args = details.args;
      this.$events.append(
        '<li>Single tx from <mark class="text-danger">' + args.owner + '</mark> ' + 
        'to <mark class="text-danger">' + args.to + '</mark>, ' +
        'sum <mark class="text-danger">' + args.value.toString() + '</mark> wei;</li>'
      );
    }).bind(this));
    this.app.wallet.contract.ConfirmationNeeded((function(err, details) {
      if (err) return console.error(err);
      var args = details.args;
      this.$txsToConfirm.append(
        '<tr>' +
        '<td data-name="id" data-id="' + args.operation + '">' + util.fold(args.operation) + '</td>' +
        '<td>' + args.initiator + '</td>' +
        '<td>' + args.to + '</td>' +
        '<td>' + args.value.toString() + '</td>' +
        '<td><button class="btn btn-success">Confirm</button></td>' +
        '</tr>'
      );
    }).bind(this));
    this.app.wallet.contract.MultiTransact((function(err, details) {
      if (err) return console.error(err);
      var args = details.args;
      this.$txsToConfirm.find('td[data-id=' + args.operation + ']').parent().remove();
      this.app.emit('walletUpdated');
      this.$events.append(
        '<li>Multisigned tx from <mark class="text-danger">' + args.owner + '</mark> ' + 
        'to <mark class="text-danger">' + args.to + '</mark>, ' +
        'sum <mark class="text-danger">' + args.value.toString() + '</mark> wei;</li>'
      );
    }).bind(this));
    this.render();
  },
  render: function() {
    this.$address.text(this.app.wallet.address);
      
    this.$topUpBtn.removeAttr('disabled');
    this.$sendTxBtn.removeAttr('disabled');
    
    this.$owners.empty();
    this.app.wallet.contract.getOwners((function(err, owners) {
      if (err) return console.error(err);
      _(owners)
        .filter(function(address) {
          return !address.isZero();
        })
        .each((function(address) {
          this.$owners.append('<li>0x' + address.toString(16) + '</li>');
        }).bind(this));
    }).bind(this));
    
    this.update();
  },
  update: function() {
    this.app.web3.eth.getBalance(this.app.wallet.address, (function(err, balance) {
      if (err) return console.error(err);
      this.$balance.text(balance.toString());
    }).bind(this));
  },
  confirm: function(pkeyDialog, e) {
    var $row = $(e.target).parent().parent();
    
    pkeyDialog.show((function(pkey) {
      this.app.wallet.confirm(
        $row.find('[data-name=id]').attr('data-id'),
        pkey,
        function(err) { if (err) console.error(err); },
        function(err) { if (err) console.error(err); }
      );
    }).bind(this));
  }
};

module.exports = wallet;