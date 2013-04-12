OpenLayers.Editor.Models.Track = OpenLayers.Class(OpenLayers.Editor.Models.Base, {

  defaults: {
    title: 'Sans titre',
    //styleMap: null,
    strokeColor: '#51b749',
    len: 0,
    gpx : null,
    dplus: 0,
    dminus: 0,
    owner : null
  },

  __vectorLayer: null,

  initialize: function(options) {

    OpenLayers.Editor.Models.Base.prototype.initialize.apply(this, ['track', options]);

    OpenLayers.Editor.TrackCollection.getInstance().add(this);

  },


  serialize: function() {
    var o = OpenLayers.Editor.Models.Base.prototype.serialize.apply(this);
    o.title = this.get('title');
    o.strokeColor = this.get('strokeColor');
    o.len = this.get('len');
    o.dminus = this.get('dminus');
    o.dplus = this.get('dplus');
    o.owner = this.get('owner');
    if (this.__vectorLayer !== null) {
      o.gpx = this.toGPX();
    } else {
      o.gpx = this.get('gpx');
    }
    return o;
  },

  hasVectorLayerLoaded: function() {
    return this.__vectorLayer !== null;
  },

  getVectorLayer: function() {
    if (this.__vectorLayer === null) {
      this.__vectorLayer = new OpenLayers.Layer.Vector();

      //if (this.get('styleMap') === null) {
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
      //}

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
        self.set('dplus', data.dplus);
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

    OpenLayers.Editor.Models.Base.prototype.remove.apply(this, [OpenLayers.Function.bind(function(err, obj) {
      if (err === null) {
        if (this.hasVectorLayerLoaded()) {
          this.__vectorLayer.destroy();
          this.__vectorLayer = null;
        }
        OpenLayers.Editor.TrackCollection.getInstance().remove(this);
        if (typeof(callback) !== 'undefined') {
          callback(err, obj);
        }

      }
    }, this)]);
  },

  _beforeSave: function(callback, opts) {
    this.refreshMetaData(OpenLayers.Function.bind(function(err) {
      callback(err, null, opts);
    }));
  },


  CLASS_NAME: 'OpenLayers.Editor.Models.Track'

});