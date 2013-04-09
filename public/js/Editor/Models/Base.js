OpenLayers.Editor.Models.Base = OpenLayers.Class({

  events: null,

  __data: null,
  __type: null,

  initialize: function(type, data) {
    this.__type = type;

    this.__data = {};
    this.defaults = this.defaults || {};

    this.defaults.rid = null;
    this.defaults.createdAt = null;
    this.defaults.updatedAt = null;

    Object.keys(this.defaults).forEach(OpenLayers.Function.bind(function(key) {
      this.__data[key] = this.defaults[key];
    }, this));

    data = this.parseServerData(data);

    Object.keys(data).forEach(OpenLayers.Function.bind(function(key) {
      if (data[key] !== 'undefined') {
        this.__data[key] = data[key];
      }
    }, this));

    this.__data.hasChanges = false;

    this.events = new OpenLayers.Events(this);
  },

  set: function(property, value, options) {

    options = options || {};

    var silent = options.silent ? options.silent : false;
    var oldValue = this.__data[property];
    var hasChange = oldValue !== value;

    this.__data[property] = value;

    if (!silent && hasChange) {
      this.events.triggerEvent('change:' + property, {
        'value': value,
        'old': oldValue,
        'property': property
      });
      this.events.triggerEvent('change', {
        'value': value,
        'old': oldValue,
        'property': property
      });
    }

    if (hasChange && property !== 'hasChanges') {
      this.set('hasChanges', true, options);
    }
  },

  get: function(property) {
    return this.__data[property];
  },

  parseServerData: function(data) {
    data = data || {};
    data.rid = data['@rid'] || null;
    if (data.createdAt) {
      data.createdAt = new Date(Date.parse(data.createdAt));
    }
    if (data.updatedAt) {
      data.updatedAt = new Date(Date.parse(data.updatedAt));
    }
    return data;
  },

  serialize: function() {
    var o = {};
    o['@rid'] = this.get('rid');
    o.createdAt = this.get('createdAt').toJSON();
    o.updatedAt = this.get('updatedAt').toJSON();
    return o;
  },


  remove: function(callback) {

    if (typeof(callback) === 'undefined') {
      callback = function() {};
    }

    if (this.get('rid') == null) {
      callback(null, this);
      return
    }

    $.ajax({
      url: "/" + this.__type + "/remove",
      type: 'POST',
      context: this,
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify({
        '@rid': this.get('rid')
      })
    }).done(function(result) {
      if (callback) {
        callback(null, this);
      }
    }).fail(function() {
      if (callback) {
        callback('La suppression a échouée');
      }
    });
  },


  _beforeSave: function(callback, opts) {
    callback(null, null, opts);
  },

  save: function(callback) {

    if (typeof(callback) == 'undefined') {
      callback = function() {};
    }

    this.set('updatedAt', new Date());

    if (this.get('createdAt') === null) {
      this.set('createdAt', this.get('updatedAt'));
    }

    this.msg = Messenger().run({
      errorMessage: "L'enregistrement a échoué",
      successMessage: "L'enregistrement a réussi",
      action: OpenLayers.Function.bind(function(opts) {
        this._beforeSave(OpenLayers.Function.bind(function(err, result, opts) {

          if (err !== null) {
            opts.error({
              status: 500,
              readyState: 0,
              responseText: 0,
            });
          } else {
            $.ajax({
              url: "/" + this.__type,
              type: 'POST',
              context: this,
              contentType: 'application/json; charset=UTF-8',
              data: JSON.stringify(this.serialize())
            }).always(OpenLayers.Function.bind(function(result, status) {
              if (status === 'success' && result.success == true) {
                this.set('rid', result.content['@rid']);
                this.set('hasChanges', false);
                opts.success();
                callback(null);
              } else {
                opts.error({
                  status: 500,
                  readyState: 0,
                  responseText: 0
                });
              }
            }, this));
          }

        }, this), opts);


      }, this)
    });

  },


  CLASS_NAME: 'OpenLayers.Editor.Models.Base'

});