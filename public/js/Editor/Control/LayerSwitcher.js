OpenLayers.Editor.Control.LayerSwitcher = OpenLayers.Class(OpenLayers.Editor.Control.ButtonPopOver, {

  buttonLabel : 'Fonds de carte',
  initialize: function(editor, options) {
    OpenLayers.Editor.Control.ButtonPopOver.prototype.initialize.apply(this, [editor]);
  },

  drawContentPane: function() {
    var editor = this.editor,
      $el = $(this.div),
      $ul = $el.find('ul'), self = this;
    $ul.empty();
    editor.map.layers.forEach(function(layer) {
      if (!layer.displayInLayerSwitcher || !layer.name) {
        return;
      }

      if (layer.visibility === true) {
        var $li = $('<li class="active">' + layer.name + '</li>');
        $ul.append($li);
      } else {
        var $li = $('<li><a href="#none">' + layer.name + '</a></li>');
        $ul.append($li);
        $li.find('a').click(function(evt) {
          evt.preventDefault();
          editor.map.setBaseLayer(layer);
          self.drawContentPane();
        });
      }
    });
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.LayerSwitcher'
});