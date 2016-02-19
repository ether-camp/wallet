var dialog = {
  init: function(app, $el) {
    this.app = app;
    this.$el = $el;
    $el.find('[data-name=sendTx]').click((function() {
      this.app.wallet.execute(
        this.$el.find('input[name=to]').val(),
        parseInt(this.$el.find('input[name=value]').val(), 10),
        (function(err) {
          if (err) console.error(err);
          else this.$el.modal('hide');
        }).bind(this),
        (function(err) {
          if (err) console.error(err);
          else this.app.emit('walletUpdated');
        }).bind(this)
      );
    }).bind(this));
    return this;
  },
  show: function() {
    this.$el.modal('show');
  }
};

module.exports = dialog;