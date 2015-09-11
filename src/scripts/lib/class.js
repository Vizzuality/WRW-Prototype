define(['underscore', 'backbone'], function(_, Backbone) {

  'use strict';

  /**
   * Helper function to correctly set up the prototype chain for subclasses.
   * Similar to `goog.inherits`, but uses a hash of prototype properties and
   * class properties to be extended.
   * @param {Object} attributes
   */
  var Class = function(attributes) {
    if (!this.initialize) {
      this.initialize = function() {};
    }
    this.initialize.apply(this, arguments);
  };

  _.extend(Class.prototype, {});

  /**
   * Using Backbone Helper
   * https://github.com/jashkenas/backbone/blob/master/backbone.js#L1821
   * @type {Object}
   */
  Class.extend = Backbone.View.extend;

  return Class;

});
