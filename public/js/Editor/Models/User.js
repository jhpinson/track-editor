OpenLayers.Editor.Models.User = OpenLayers.Class(OpenLayers.Editor.Models.Base, {

  defaults: {
    fullname: null,
    email : null
  },


  initialize: function(data) {

    OpenLayers.Editor.Models.Base.prototype.initialize.apply(this, ['user', data]);
  },

  parseServerData : function (data) {
    data = OpenLayers.Editor.Models.Base.prototype.parseServerData.apply(this, [data]);

    // nothing to do at this time

    return data;
  },

  serialize: function() {
    var o = OpenLayers.Editor.Models.Base.prototype.serialize.apply(this);
    o.title = this.get('title');
    o.strokeColor = this.get('strokeColor');
    o.len = this.get('len');
    o.dminus = this.get('dminus');
    o.dplus = this.get('dplus');

    if (this.__vectorLayer !== null) {
      o.gpx = this.toGPX();
    } else {
      o.gpx = this.get('gpx');
    }
    return o;
  },



  CLASS_NAME: 'OpenLayers.Editor.Models.User'

});