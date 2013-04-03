OpenLayers.Editor.Control.StopEditing = OpenLayers.Class(OpenLayers.Control.Button, {

    editor: null,
    track : null,
    bootstrapIcon : 'icon-ok',

    initialize: function (editor, track) {
        this.editor = editor;
        this.track = track;
        this.title = 'Quitter';
        OpenLayers.Control.Button.prototype.initialize.apply(this);
        this.trigger = this.stopEditing;
    },

    stopEditing: function () {

        if (this.track.get('hasChanges') === true) {

          if (this.track.getVectorLayer().features.length > 0) {
            bootbox.confirm("<p>Ce parcours contient des modifications qui n'ont pas été enregistrées.</p><p>Sauvegarder maintenant ?</p>",
              OpenLayers.Function.bind(function (save) {
                this.editor.stopEditing();
                if (save === true) {
                  this.track.save();
                }
              }, this));
          } else {
            this.editor.stopEditing();
            this.track.remove()
          }
          return;
        }

        if (this.track.getVectorLayer().features.length > 0) {
          this.editor.stopEditing();
        } else {
          this.editor.stopEditing();
          this.track.remove()
        }


    },

    CLASS_NAME: 'OpenLayers.Editor.Control.StopEditing'
});