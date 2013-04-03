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
    options.rid =  options['@rid'] || null;
    options.title =  options.title || 'Sans titre';
    options.strokeColor =  options.strokeColor || '#51b749';
    options.len = options.len || null;
    options.dplus =  options.dplus || null;
    options.dminus =  options.dminus || null;
    if (options.createdAt) {
      options.createdAt =  new Date(Date.parse(options.createdAt));
    }
    if (options.updatedAt) {
      options.updatedAt = new Date(Date.parse(options.updatedAt));
    }
    options.gpx = options.gpx || null;

    OpenLayers.Editor.Model.prototype.initialize.apply(this, [options]);

    OpenLayers.Editor.TrackCollection.getInstance().add(this);

  },

  hasVectorLayerLoaded: function() {
    return this.__vectorLayer !== null;
  },

  getVectorLayer: function() {
    if (this.__vectorLayer === null) {
      this.__vectorLayer = new OpenLayers.Layer.Vector();

      if (this.get('styleMap') === null) {
        this.__vectorLayer.styleMap = new OpenLayers.StyleMap({
          'default': new OpenLayers.Style({
            fillColor: this.get('strokeColor'),
            fillOpacity: 0.8,
            strokeColor: this.get('strokeColor'),
            strokeOpacity: 0.6,
            strokeWidth: 4,
            graphicZIndex: 1,
            pointRadius: 5
          }),
          'select': new OpenLayers.Style({
            fillColor: this.get('strokeColor'),
            strokeColor: this.get('strokeColor'),
            graphicZIndex: 2
          }),
          'temporary': new OpenLayers.Style({
            fillColor: this.get('strokeColor'),
            fillOpacity: 0.8,
            strokeColor: this.get('strokeColor'),
            strokeWidth: 4,
            strokeOpacity: 0.6,
            graphicZIndex: 2,
            pointRadius: 5
          })
        });
      }

      if (this.get('gpx') !== null) {
        var options = {
          'internalProjection': new OpenLayers.Projection('EPSG:900913'),
          'externalProjection': new OpenLayers.Projection('EPSG:4326')
        };
        this.__vectorLayer.addFeatures((new OpenLayers.Editor.GPX(options)).read(this.get('gpx')));
      }


    }

    return this.__vectorLayer;
  },


  toGPX: function() {
    var options = {
      'internalProjection': new OpenLayers.Projection('EPSG:900913'),
      'externalProjection': new OpenLayers.Projection('EPSG:4326')
    };
    return (new OpenLayers.Editor.GPX(options)).write(this.getVectorLayer().features);
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

  refreshMetaData: function(callback, force) {
    force = force === true;
    var missingPoints = [],
      locations = [],
      self = this;

    var createTask = function(locations, points) {
      var retryCount = 5;
      var closureCallback = null;
      var doRequest = function(callback) {

        //$.get('/track/elevation?sensor=false&locations=' + locations.join('|'),
        $.get('http://maps.googleapis.com/maps/api/elevation/json?sensor=false&locations=' + locations.join('|'),

        function(response, status, xhr) {
          if (status == 'success') {
            if (response.status == 'OK') {
              for (var i = 0, l = response.results.length; i < l; i++) {
                points[i].z = Math.round(response.results[i].elevation);
                //points[i].z = Math.round(points[i].z + 10) / 10;
              }
              callback(null);
            } else if (retryCount > 0 && response.status == 'OVER_QUERY_LIMIT') {
              closureCallback = callback;
              retryCount--;
              setTimeout(function() {
                doRequest(closureCallback);
              }, 1000);
            } else {
              callback('failed');
            }
          } else {
            callback('failed');
          }
        })
      }

      return doRequest;
    }


    //locations=40.714728,-73.998672|-34.397,150.644
    this.getVectorLayer().features.forEach(function(feature) {
      if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
        feature.geometry.components.forEach(function(p) {
          if (p.z === null || force) {
            var point = p.clone().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
            missingPoints.push(p);
            locations.push(point.y + ',' + point.x)
          }
        });
      } else {
        console.warn('TODO: "OpenLayers.Geometry.Point"')
      }
    });

    //qs = 'locations=' + locations.join('|');
    var tasks = [],
      self = this;
    while (locations.length > 0) {
      tasks.push(createTask(locations.splice(0, 40), missingPoints.splice(0, 40)));
    }
    async.series(tasks, function(err, results) {

      self.set('gpx', self.toGPX());

      if (err == null) {
        var data = {
          len: 0,
          dplus: 0,
          dminus: 0
        };
        self.getVectorLayer().features.forEach(function(feature) {
          var lastPoint = null;
          if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.LineString") {
            feature.geometry.components.forEach(function(point) {
              point = point.clone().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));

              if (lastPoint !== null) {
                var distance = OpenLayers.Util.distVincenty(new OpenLayers.LonLat(lastPoint.x, lastPoint.y), new OpenLayers.LonLat(point.x, point.y));
                data.len += distance;
                if (point.z > lastPoint.z) {
                  data.dplus += point.z - lastPoint.z;
                } else {
                  data.dminus += lastPoint.z - point.z;
                }
              }
              lastPoint = point

            });
          }
        });
        self.set('len', Math.round(data.len * 10) / 10);
        self.set('dplus',data.dplus);
        self.set('dminus', data.dminus);
        callback(null, self)
      } else {

        callback(err);
        Messenger().post({
          message: "Erreur pendant la récupération des altitudes",
          type: 'error',
          hideAfter: 2,
          showCloseButton: true
        });
      }
    })
  },

  remove: function(callback) {

    if (typeof(callback) === 'undefined') {
      callback = function () {};
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

  redraw: function() {
    if (this.hasVectorLayerLoaded()) {
      this.__vectorLayer.styleMap.styles.
      default.defaultStyle.strokeColor = this.get('strokeColor');
      this.__vectorLayer.styleMap.styles.select.defaultStyle.strokeColor = this.get('strokeColor');
      this.__vectorLayer.styleMap.styles.temporary.defaultStyle.strokeColor = this.get('strokeColor');

      this.__vectorLayer.styleMap.styles.
      default.defaultStyle.fillColor = this.get('strokeColor');
      this.__vectorLayer.styleMap.styles.select.defaultStyle.fillColor = this.get('strokeColor');
      this.__vectorLayer.styleMap.styles.temporary.defaultStyle.fillColor = this.get('strokeColor');


      this.__vectorLayer.redraw();
    }
  },

  save: function(callback) {

    if (typeof(callback) == 'undefined') {
      callback = function () {};
    }

    this.set('updatedAt', new Date());

    if (this.get('createdAt') === null) {
      this.set('createdAt',this.get('updatedAt'));
    }


    this.msg = Messenger().run({
      errorMessage: "L'enregistrement a échoué",
      successMessage: "L'enregistrement a réussi",
      action: OpenLayers.Function.bind(function(opts) {

        this.refreshMetaData(OpenLayers.Function.bind(function(err) {

          if (err !== null) {

            opts.error({
              status: 500,
              readyState: 0,
              responseText: 0,
            });
            return;
          }

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
        }, this), false);

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
        this.set('rid',result.content['@rid']);
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


  CLASS_NAME: 'OpenLayers.Editor.Track'

});