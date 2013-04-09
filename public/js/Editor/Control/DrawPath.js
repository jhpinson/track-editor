OpenLayers.Editor.Control.DrawPath = OpenLayers.Class(OpenLayers.Control.DrawFeature, {

  /**
   * Property: minLength
   * {Number} Minimum length of new paths.
   */
  minLength: 0,

  title: 'Créer un segment',
  bootstrapIcon: 'icon-pencil',

  /**
   * Constructor: OpenLayers.Editor.Control.DrawPath
   * Create a new control for drawing paths.
   *
   * Parameters:
   * layer - {<OpenLayers.Layer.Vector>} Paths will be added to this layer.
   * options - {Object} An optional object whose properties will be used
   *     to extend the control.
   */
  initialize: function(layer, options) {

    OpenLayers.Control.DrawFeature.prototype.initialize.apply(this, [layer, OpenLayers.Handler.Path, options]);


  },

  deactivate: function() {
    try {
      this.finishSketch();
    } catch (e) {

    }
    OpenLayers.Control.DrawFeature.prototype.deactivate.apply(this);
  },

  /**
   * Method: draw path only if area greater than or equal to minLength
   */
  drawFeature: function(geometry) {

    geometry = this._mergeGeometry(geometry);

    var feature = new OpenLayers.Feature.Vector(geometry),
      proceed = this.layer.events.triggerEvent('sketchcomplete', {
        feature: feature
      });
    if (proceed !== false && geometry.getLength() >= this.minLength) {
      feature.state = OpenLayers.State.INSERT;
      this.layer.addFeatures([feature]);
      this.featureAdded(feature);
      this.events.triggerEvent('featureadded', {
        feature: feature
      });
    }
  },

  /**
   * Method: return true if points are identicals
   */
  _pointsAreSame: function(a, b) {
    return a.x == b.x && a.y == b.y;
  },
  /**
   * Method: merge new geometry with existing features
   */
  _mergeGeometry: function(geometry) {
    for (var i = 0, il = this.layer.features.length; i < il; i++) {
      var feature = this.layer.features[i];
      if (this._pointsAreSame(feature.geometry.components[0], geometry.components[0])) {
        // first point of new geometry is same as first point of an existing one
        var points = feature.geometry.getVertices();
        for (var j = 1, jl = points.length; j < jl; j++) {
          geometry.addPoint(points[j], 0);
        }
        feature.destroy();
        return this._mergeGeometry(geometry);

      } else if (this._pointsAreSame(feature.geometry.components[feature.geometry.components.length - 1], geometry.components[0])) {
        var points = feature.geometry.getVertices();
        for (var j = points.length - 1; j >= 0; j--) {
          geometry.addPoint(points[j], 0);
        }
        feature.destroy();
        return this._mergeGeometry(geometry);
      } else if (this._pointsAreSame(feature.geometry.components[0], geometry.components[geometry.components.length - 1])) {
        var points = feature.geometry.getVertices();
        for (var j = 1, jl = points.length; j < jl; j++) {
          geometry.addPoint(points[j]);
        }
        feature.destroy();
        return this._mergeGeometry(geometry);
      } else if (this._pointsAreSame(feature.geometry.components[feature.geometry.components.length - 1], geometry.components[geometry.components.length - 1])) {
        var points = feature.geometry.getVertices();
        for (var j = points.length - 1; j >= 0; j--) {
          geometry.addPoint(points[j]);
        }
        feature.destroy();
        return this._mergeGeometry(geometry);
      }
    }

    return geometry;
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.DrawPath'
});