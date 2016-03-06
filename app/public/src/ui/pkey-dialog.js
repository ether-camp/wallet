var util = require('../util');

var dialog = {
  init: function($el) {
    this.$el = $el;
    this.$pkey = $el.find('input[name=pkey]');
    this.$send = $el.find('button[data-name=send]');
    
    $el.on('show.bs.modal', (function() {
      this.$pkey.focus();
    }).bind(this));
    
    return this;
  },
  show: function(cb) {
    this.$el.modal('show');
    this.$el.find('form').submit((function(e) {
      e.preventDefault();
      
      var pkey = this.$pkey.val();
      if (!util.isPkey(pkey)) pkey = util.sha3(pkey);
      
      this.$el.modal('hide');
      
      cb(pkey);
    }).bind(this));
  }
};

module.exports = dialog;