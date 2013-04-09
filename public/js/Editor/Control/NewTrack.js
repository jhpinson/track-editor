OpenLayers.Editor.Control.NewTrack = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

    editor: null,


    initialize: function (editor, options) {
        this.editor = editor;
        this.title = 'Créer un nouveau parcours';
        OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor]);
        this.trigger = this.startEditing;
    },

    draw: function (px) {
      var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]);
      var $div = $(div);

      var $button = $('<button class="btn btn-mini btn-warning" type="button">'+this.title+'</button>')
      $div.append($button);

      var self = this;
      $button.click(function () {
        self.startEditing();
      });

      return div;
    },

    startEditing: function () {
        this.editor.startEditing(new OpenLayers.Editor.Models.Track());
    },

    CLASS_NAME: 'OpenLayers.Editor.Control.NewTrack'
});