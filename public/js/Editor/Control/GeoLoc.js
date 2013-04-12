OpenLayers.Editor.Control.GeoLoc = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  editor: null,
  track: null,
  $picker : null,

  initialize: function(editor, track, options) {
    this.editor = editor;
    this.track = track;

    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor, options]);

  },


  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]),
      track = this.track, editor = this.editor, self = this;
    var $div = $(div);

    var html = '<div class="input-prepend">' +
                  '<span class="add-on">@</span>' +
                  '<input type="text" placeholder="Position">' +
                '</div>';

    $div.append(html);
    return div;
  },




  CLASS_NAME: 'OpenLayers.Editor.Control.GeoLoc'

});