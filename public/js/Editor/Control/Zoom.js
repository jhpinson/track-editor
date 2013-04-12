OpenLayers.Editor.Control.Zoom = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  editor: null,

  initialize: function(editor, options) {
    this.editor = editor;

    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor, options]);

  },


  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]),
      track = this.track, editor = this.editor, self = this;
    var $div = $(div);

    var $zoomOut = $('<button class="btn btn-mini btn-info"  type="button" data-toggle="button">-</button>');
    var $zoomIn = $('<button class="btn btn-mini btn-info"  type="button" data-toggle="button">+</button>');

    var $buttonGroup = $('<div class="btn-group"></div>');

    $zoomOut.click(OpenLayers.Function.bind(function () {
      this.editor.map.zoomOut();
    },this));

    $zoomIn.click(OpenLayers.Function.bind(function () {
      this.editor.map.zoomIn();
    },this));

    $buttonGroup.append($zoomOut);
    $buttonGroup.append($zoomIn);

    $div.append($buttonGroup);
    return div;
  },




  CLASS_NAME: 'OpenLayers.Editor.Control.Zoom'

});