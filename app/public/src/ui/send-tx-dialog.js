var util = require('../util');

var dialog = {
  init: function(app, $el) {
    this.app = app;
    this.$el = $el;
    this.$to = this.$el.find('input[name=to]');
    this.$value = this.$el.find('input[name=value]');
    this.$pkey = this.$el.find('input[name=pkey]');
    $el.find('[data-name=sendTx]').click(this.send.bind(this));
    $el.find('form').submit(this.send.bind(this));
    
    $el.on('shown.bs.modal', (function() {
      this.$to.focus();
    }).bind(this));
    
    return this;
  },
  show: function() {
    this.$el.modal('show');
    this.$to.val('');
    this.$value.val('');
  },
  send: function(e) {
    e.preventDefault();
    
    var pkey = this.$pkey.val();
    if (!util.isPkey(pkey)) pkey = util.sha3(pkey);
    
    this.app.wallet.execute(
      this.$to.val(),
      parseInt(this.$value.val(), 10),
      pkey,
      (function(err) {
        if (err) console.error(err);
        else this.$el.modal('hide');
      }).bind(this),
      (function(err) {
        if (err) console.error(err);
        else this.app.emit('walletUpdated');
      }).bind(this)
    );
  }
};

module.exports = dialog;