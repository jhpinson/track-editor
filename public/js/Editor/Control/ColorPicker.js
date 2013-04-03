OpenLayers.Editor.Control.ColorPicker = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  editor: null,
  track: null,
  $picker : null,

  initialize: function(editor, track) {
    this.editor = editor;
    this.track = track;

    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor]);

  },


  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]),
      track = this.track, editor = this.editor, self = this;
    var $div = $(div);
    var $picker = $('<select  unselectable="on" name="colorpicker-picker"><option value="#7bd148">Green</option><option value="#5484ed">Bold blue</option><option value="#a4bdfc" disabled>Blue</option><option value="#46d6db">Turquoise</option><option value="#7ae7bf">Light green</option><option value="#51b749">Bold green</option><option value="#fbd75b">Yellow</option><option value="#ffb878">Orange</option><option value="#ff887c" disabled>Red</option><option value="#dc2127">Bold red</option><option value="#dbadff">Purple</option><option value="#e1e1e1">Gray</option>select>');
    this.$picker = $picker;
    $div.append($picker);
    $picker.simplecolorpicker({
      picker: true
    }).on('change', function() {
      track.set('strokeColor',$picker.val());
      //track.save()
      track.redraw();
    }).on('show', function() {
      editor.events.triggerEvent('showInlineHTML', self);
    });

    $picker.simplecolorpicker('selectColor', track.get('strokeColor'));
    return div;
  },

  onShowInlineHTML : function (sender) {
      if (sender != this) {
        $(this.div).find('select').simplecolorpicker('hidePicker');

      }
    },

  destroy : function () {
    $(this.div).find('select').simplecolorpicker('destroy');
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.ColorPicker'

});