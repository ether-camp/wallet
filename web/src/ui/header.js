var header = {
  init: function(app, $el, selectAccountDialog) {
    this.app = app;
    this.$address = $el.find('#account');
    this.$balance = $el.find('#accountBalance');
    
    $el.find('#selectAccountButton').click(function(e) {
      e.preventDefault();
      selectAccountDialog.show();
    });
    
    app.on('accountSelected', (function() {
      this.$address.text(app.account.address);
      this.update();
    }).bind(this));
    app.on('accountUpdated', this.update.bind(this));
    
    return this;
  },
  update: function() {
    this.app.web3.eth.getBalance(this.app.account.address, (function(err, balance) {
      if (err) return console.error(err);
      this.$balance.text(balance.toString());
    }).bind(this));
  }
};

module.exports = header;