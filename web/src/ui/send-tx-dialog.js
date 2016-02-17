var dialog = {
  init: function(app, $el) {
    this.$el = $el;
    $el.find('[data-name=sendTx]').click(function() {
      var to = $el.find('input[name=to]').val();
      var value = $el.find('input[name=value').val();
      app.wallet.execute(to, value, '', function(err, txHash) {
        if (err) return console.error(err);
      });
    });
    return this;
  },
  show: function() {
    this.$el.modal('show');
  }
};

module.exports = dialog;