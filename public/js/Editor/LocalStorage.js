OpenLayers.Editor.LocalStorage = OpenLayers.Class({

  storage : null,

  initialize : function () {
    this.storage = window.localStorage
  },

  save : function (key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  },

  get : function (key) {
    return JSON.parse(this.storage.getItem(key));
  },

  remove : function (key) {
    this.storage.removeItem(key);
  },

  keys : function (filter) {


    if (filter) {
      var keys = [];
      Object.keys(this.storage).forEach(function (key) {
        if (filter.test(key)) {
          keys.push(key);
        }
      });
      return keys;
    } else {
      return Object.keys(this.storage);
    }

  },

  CLASS_NAME: 'OpenLayers.Editor.LocalStorage'

});

OpenLayers.Editor.localStorage = new OpenLayers.Editor.LocalStorage();