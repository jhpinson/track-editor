OpenLayers.Editor.Model = OpenLayers.Class({

  events : null,

  __data : null,

  initialize : function (data) {
    this.__data = {};
    this.defaults = this.defaults || {};

    Object.keys(this.defaults).forEach(OpenLayers.Function.bind(function (key) {
      this.__data[key] = this.defaults[key];
    }, this));

    Object.keys(data).forEach(OpenLayers.Function.bind(function (key) {
      this.__data[key] = data[key];
    }, this));

    this.__data.hasChanges = false;

    this.events = new OpenLayers.Events(this);
  },

  set : function (property, value, options) {

    options = options || {};

    var silent = options.silent ? options.silent : false;
    var oldValue = this.__data[property];
    var hasChange = oldValue !== value;

    this.__data[property] = value;

    if (!silent && hasChange) {
      this.events.triggerEvent('change:' + property, {'value' : value, 'old' : oldValue, 'property' : property});
      this.events.triggerEvent('change', {'value' : value, 'old' : oldValue, 'property' : property});
    }

    if (hasChange && property !== 'hasChanges') {
      this.set('hasChanges', true, options);
    }
  },

  get : function (property) {
    return this.__data[property];
  },


  CLASS_NAME: 'OpenLayers.Editor.Model'

});