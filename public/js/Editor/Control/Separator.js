OpenLayers.Editor.Control.Separator = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {



  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]);
    $(div).addClass('separator');
    return div;
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.Separator'

});