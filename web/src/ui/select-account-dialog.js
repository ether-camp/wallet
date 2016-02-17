var util = require('../util');

var dialog = {
  init: function(app, $el) {
    this.app = app;
    this.$el = $el;
    
    $el.find('[data-name=selectAccount]').click(function() {
      var pkey = $el.find('input[name=pkeyOrSeed]').val();
      if (!util.isPkey(pkey)) pkey = util.sha3(pkey);
      app.account = {
        pkey: pkey,
        address: util.toAddress(pkey)
      };
      app.emit('accountSelected');
      $el.modal('hide');
    });
    
    return this;
  },
  show: function() {
    this.$el.modal('show');
  }
};

module.exports = dialog;