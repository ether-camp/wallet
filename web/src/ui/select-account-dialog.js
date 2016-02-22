var util = require('../util');

var dialog = {
  init: function(app, $el) {
    this.app = app;
    this.$el = $el;
    this.$pkeyOrSeed = $el.find('input[name=pkeyOrSeed]');
    $el.find('[data-name=selectAccount]').click(this.select.bind(this));
    $el.find('form').submit(this.select.bind(this));
    
    $el.on('shown.bs.modal', (function() {
      this.$pkeyOrSeed.focus();
    }).bind(this));
    return this;
  },
  show: function() {
    this.$el.modal('show');
    this.$pkeyOrSeed.val('');
  },
  select: function(e) {
    e.preventDefault();
    
    var pkey = this.$pkeyOrSeed.val();
    if (!util.isPkey(pkey)) pkey = util.sha3(pkey);
    this.app.account = {
      pkey: pkey,
      address: util.toAddress(pkey)
    };
    this.app.emit('accountSelected');
    this.$el.modal('hide');
  }
};

module.exports = dialog;