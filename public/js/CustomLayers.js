OpenLayers.Layer.Google.Terrain = OpenLayers.Class(OpenLayers.Layer.Google, {
  type: google.maps.MapTypeId.TERRAIN,
  MAX_ZOOM_LEVEL: 15,
  CLASS_NAME: "OpenLayers.Google.Terrain"
});
OpenLayers.Layer.Google.Photo = OpenLayers.Class(OpenLayers.Layer.Google, {
  type: google.maps.MapTypeId.SATELLITE,
  CLASS_NAME: "OpenLayers.Google.Photo"
});
OpenLayers.Layer.Google.Hybrid = OpenLayers.Class(OpenLayers.Layer.Google, {
  type: google.maps.MapTypeId.HYBRID,
  CLASS_NAME: "OpenLayers.Google.Hybrid"
});

OpenLayers.Layer.IGN = OpenLayers.Class(OpenLayers.Layer.WMTS, {
  layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS',
  maxZoomLevel: 18,
  initialize: function(name, cle) {
    OpenLayers.Layer.WMTS.prototype.initialize.call(this, {
      name: name,
      url: 'http://gpp3-wxs.ign.fr/' + cle + '/wmts',
      layer: this.layer,
      matrixSet: 'PM',
      style: 'normal',
      projection: 'EPSG:900913',
      maxZoomLevel: this.maxZoomLevel,
      attribution: '&copy;IGN ' + '<a href="http://www.geoportail.fr/" target="_blank">' + '<img src="http://api.ign.fr/geoportail/api/js/2.0.0beta/theme/geoportal/img/logo_gp.gif">' + '</a> ' + '<a href="http://www.geoportail.gouv.fr/depot/api/cgu/licAPI_CGUF.pdf" alt="TOS" title="TOS" target="_blank">' + 'Terms of Service' + '</a>'
    });
  },
  CLASS_NAME: "OpenLayers.Layer.IGN"
});
OpenLayers.Layer.IGN.Photo = OpenLayers.Class(OpenLayers.Layer.IGN, {
  layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
  maxZoomLevel: 19,
  CLASS_NAME: "OpenLayers.Layer.IGN.Photo"
});
OpenLayers.Layer.IGN.Cadastre = OpenLayers.Class(OpenLayers.Layer.IGN, {
  layer: 'CADASTRALPARCELS.PARCELS',
  maxZoomLevel: 19,
  CLASS_NAME: "OpenLayers.Layer.IGN.Cadastre"
});