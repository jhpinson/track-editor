OpenLayers.Editor.Control.Upload = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  editor: null,
  track: null,
  $picker: null,

  initialize: function(editor) {
    this.editor = editor;

    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor]);

  },


  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]),
      editor = this.editor,
      self = this;
    var $div = $(div);

    //$div.append('<input type="file">')
    $div.append('<span class="btn btn-mini btn-success fileinput-button">' +
                    '<i class="icon-plus icon-white"></i>' +
                    '<span>Uploader un parcours</span>' +
                    '<input type="file" name="files[]" multiple>' +
                '</span>');

    $('body').fileupload({
      dropZone: $('body'),
      fileInput: $div.find('input'),
      dataType: 'json',
      url : '/track/upload',
      done: function(e, data) {
          var track = new OpenLayers.Editor.Models.Track(data.result);
         editor.showTrack(track);
         track.save();
      }
    });

    return div;
  },



  CLASS_NAME: 'OpenLayers.Editor.Control.Upload'

});