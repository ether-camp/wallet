var _ = require('lodash');

var wallet = {
  init: function(app, $el, topUpDialog, sendTxDialog) {
    this.app = app;
    
    this.$address = $el.find('#walletAddress');
    this.$balance = $el.find('#walletBalance');
    this.$topUpBtn = $el.find('#topUpBtn');
    this.$sendTxBtn = $el.find('#sendTxBtn');
    this.$owners = $el.find('#walletOwners');

    this.$topUpBtn.click(topUpDialog.show.bind(topUpDialog));
    this.$sendTxBtn.click(sendTxDialog.show.bind(sendTxDialog));

    if (app.account) this.update();
    else app.once('walletLoaded', this.render.bind(this));
    
    app.on('walletUpdate', this.update.bind(this));
    
    return this;
  },
  render: function() {
    this.$address.text(this.app.wallet.address);
      
    this.$topUpBtn.removeAttr('disabled');
    this.$sendTxBtn.removeAttr('disabled');
    
    this.$owners.empty();
    this.app.wallet.getOwners((function(err, owners) {
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
  }
};

module.exports = wallet;