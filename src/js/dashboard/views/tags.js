define([
  'underscore',
  'backbone',
  'handlebars',
  'views/abstract/base',
  'text!templates/tags.handlebars'
], function(_, Backbone, Handlebars, BaseView, tpl) {

  'use strict';

  var TagView = Backbone.View.extend({
    tagName: 'li',

    events: {
      'click': 'onClick'
    },

    initialize: function(options) {
      this.tag = options.tag;
    },

    render: function() {
      this.$el.html(this.tag.get('name'));

      if (this.tag.get('selected') === true) {
        this.$el.addClass('selected');
      } else {
        this.$el.removeClass('selected');
      }

      return this;
    },

    onClick: function() {
      var selected = !this.tag.get('selected');
      this.tag.set('selected', selected);
    }
  });

  var TagsView = BaseView.extend({
    template: Handlebars.compile(tpl),

    tagName: 'ul',

    initialize: function(options) {
      this.tags = options.tags;
    },

    render: function() {
      this.tags.each(function(tag) {
        var tagView = new TagView({tag: tag});
        this.$el.append(tagView.render().el);
      }.bind(this));

      return this;
    }
  });

  return TagsView;

});
