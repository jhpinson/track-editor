OpenLayers.Editor.Control.Mask = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {



  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]);
    var $div = $(div);
    return div;
  },

  activate : function () {
    console.debug('show mask')
  },

  deactivate : function () {
    console.debug('hide mask')
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.Mask'

});

OpenLayers.Editor.Control.Mask.instance = null,
OpenLayers.Editor.Control.Mask.getInstance = function() {
  if (OpenLayers.Editor.Control.Mask.instance == null) {
    OpenLayers.Editor.Control.Mask.instance = new OpenLayers.Editor.Control.Mask();
  }
  return OpenLayers.Editor.Control.Mask.instance;
}