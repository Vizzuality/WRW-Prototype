define([
  'underscore',
  'backbone',
], function(_, Backbone) {

  'use strict';

  var ModalModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
    }
  });



  var ModalView = Backbone.View.extend({

    initialize: function() {

      this.model = new ModalModel();

      this.cacheVars();
      this.setListeners();
    },

    events: function() {
      if (window.ontouchstart) {
        return  {
          'touchstart .modal-close': 'hide',
          'touchstart .modal-shadow': 'hide',
        };
      }
      return {
        'click .modal-close': 'hide',
        'click .modal-shadow': 'hide',
      };
    },

    cacheVars: function() {
      this.$document = $(document);
      this.$body = $('body');

      this.$content = this.$el.find('.modal-content');
      this.$shadow = this.$el.find('.modal-shadow');
    },

    setListeners: function () {
      this.model.on('change:hidden', this.toggleVisibility, this);

      this.$body.on('click', '.modal-link' , _.bind(function(e){
        e && e.preventDefault();
        this.setContent($(e.currentTarget).data('modal'));
      }, this));
    },

    setContent: function(content_id) {
      this.$content.html($('#' + content_id).clone());
      this.show();
    },

    toggleVisibility: function() {
      var hidden = !!this.model.get('hidden');
      if (!!this.model.get('hidden')) {
        this.$el.removeClass('is-active');
        this._stopBindings();
      } else {
        this.$el.addClass('is-active');
        this._initBindings();
      }
    },

    // BINDINGS
    _initBindings: function() {
      // document keyup
      this.$document.on('keyup', _.bind(function(e) {
        if (e.keyCode === 27) {
          this.hide();
        }
      },this));
    },

    _stopBindings: function() {
      this.$document.off('keyup');
      this.$shadow.off('click');
    },

    // VISIBILITY
    show: function() {
      this.model.set('hidden', false);
    },

    hide: function () {
      this.model.set('hidden', true);
    },




  });

  return ModalView;

});
