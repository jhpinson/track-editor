OpenLayers.Editor.Track = OpenLayers.Class(OpenLayers.Editor.Model, {

  defaults: {
    rid: null,
    title: null,

    styleMap: null,
    strokeColor: null,

    createdAt: null,
    updatedAt: null,

    len: null,
    dplus: null,
    dminus: null,
  },



  __vectorLayer: null,

  initialize: function(options) {


    options = options || {};
    options.rid = options['@rid'] || null;
    options.title = options.title || 'Sans titre';
    options.strokeColor = options.strokeColor || '#51b749';
    options.len = options.len || null;
    options.dplus = options.dplus || null;
    options.dminus = options.dminus || null;
    if (options.createdAt) {
      options.createdAt = new Date(Date.parse(options.createdAt));
    }
    if (options.updatedAt) {
      options.updatedAt = new Date(Date.parse(options.updatedAt));
    }
    OpenLayers.Editor.Model.prototype.initialize.apply(this, [options]);
  },


  serialize: function() {
    var o = {};
    o.title = this.get('title');
    o.strokeColor = this.get('strokeColor');
    o.len = this.get('len');
    o.dminus = this.get('dminus');
    o.dplus = this.get('dplus');
    o['@rid'] = this.get('rid');
    if (this.__vectorLayer !== null) {
      o.gpx = this.toGPX();
    } else {
      o.gpx = this.get('gpx');
    }

    o.createdAt = this.get('createdAt').toJSON();
    o.updatedAt = this.get('updatedAt').toJSON();

    return o;
  },
  remove: function(callback) {

    if (typeof(callback) === 'undefined') {
      callback = function() {};
    }

    if (this.hasVectorLayerLoaded()) {
      this.__vectorLayer.destroy();
    }
    OpenLayers.Editor.TrackCollection.getInstance().remove(this);

    if (this.get('rid') == null) {
      callback(null, this);
      return
    }

    $.ajax({
      url: "/track/remove",
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

        this._save(OpenLayers.Function.bind(function(err) {

          if (err === null) {
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

      }, this)
    });


    /*
    this.refreshMetaData(OpenLayers.Function.bind(function (err) {
      this._save(callback);
    }, this), false);
    */



  },

  _save: function(callback) {
    $.ajax({
      url: "/track",
      type: 'POST',
      context: this,
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(this.serialize())
    }).done(function(result) {
      result = JSON.parse(result);
      if (result.success == true) {
        this.set('rid', result.content['@rid']);
      }
      this.set('hasChanges', false)

      if (callback) {
        callback(result.success ? null : result.error, this);
      }
    }).fail(function() {
      if (callback) {
        callback('La sauvegarde a échouée');
      }
    });
  },


  CLASS_NAME: 'OpenLayers.Editor.User'

});