define([
  'backbone',
  'underscore'
], function(Backbone, _) {

  var SignUpView = Backbone.View.extend({

    initialize: function() {
      this.$overlay = $('.js-overlay');
      this.$modal = $('.js-modal');
      this.$button = $('.js-signup');
      this.setListeners();
    },

    setListeners: function() {
      this.$button.on('click', _.bind(this.openModal, this));
    },

    openModal: function(e) {
      e.preventDefault();
      this.$overlay.removeClass('is-hidden');
      this.$modal.removeClass('is-hidden');

      this.$overlay.off().on('click', _.bind(this.closeModal, this));
    },

    closeModal: function(e) {
      e.preventDefault();
      this.$overlay.addClass('is-hidden');
      this.$modal.addClass('is-hidden');
    }

  });

  return SignUpView;

});
