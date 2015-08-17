define([
  'underscore',
  'backbone',
  'backbone-super',
  'views/abstract/base',
  'text!templates/infowindow.handlebars'
], function(_, Backbone, bSuper, BaseView, TPL) {

  'use strict';

  var ModalWindowView = BaseView.extend({

    template: TPL,

    events: function() {
      if (window.ontouchstart) {
        return  {
          'touchstart .btn-close-modal': 'close',
          'touchstart .modal-background': 'close',
          'touchstart .btn-close': 'close'
        };
      }
      return {
        'click .btn-close-modal': 'close',
        'click .modal-background': 'close',
        'click .btn-close': 'close'
      };
    },

    serialize: function() { return this.data; },

    initialize: function(data) {
      if(data) {
        this.data = data;
        this.render();
      }
      $(document).keyup(_.bind(this.onKeyUp, this));
    },

    afterRender: function() {
      this.toggleState();
    },

    onKeyUp: function(e) {
      e.stopPropagation();
      // press esc
      if (e.keyCode === 27) { this.close(); }
    },

    close: function() {
      this.toggleState();
      this.destroy();
    },

    toggleState: function() {
      this.$el.toggleClass('has-no-scroll');
      $('html').toggleClass('has-no-scroll');
    },

    beforeDestroy: function() {
      $(document).off('keyup');
    }

  });

  return ModalWindowView;

});
