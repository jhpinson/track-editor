OpenLayers.Editor.Control.NewTrack = OpenLayers.Class(OpenLayers.Editor.Control.ButtonPopOver, {

  buttonLabel: 'Nouveau',
  buttonClass: 'btn-primary',

  editor: null,
  closeTimeout: null,
  $createButton: null,

  initialize: function(editor, options) {
    OpenLayers.Editor.Control.ButtonPopOver.prototype.initialize.apply(this, [editor]);
    editor.events.register('startEditing', this, this.startEditing);
    editor.events.register('stopEditing', this, this.stopEditing);
  },

  startEditing: function() {
    this.$createButton.parent('li').addClass('disabled');
  },

  stopEditing: function() {
    this.$createButton.parent('li').removeClass('disabled');
  },

  $ul: null,
  getUl: function() {
    if (this.$ul === null) {
      var $el = $(this.div),
        $ul = $el.find('ul'),
        editor = this.editor,
        self = this;

      $ul.empty();

      $li = $('<li></li>');
      var $createButton = $('<a href="#none" rel="track-create" >Créer un nouveau parcours</a>');
      this.$createButton = $createButton;
      $createButton.click(OpenLayers.Function.bind(this.createTrack, this));
      $li.append($createButton)
      $ul.append($li);

      $li = $('<li></li>');
      var $uploadButton = $('<span class="fileinput-button">' +
        '<a href="#none">Télécharger un parcours (GPX)</a>' +
        '<input type="file" name="files[]" multiple>' +
        '</span>');


      $('body').fileupload({
        dropZone: $('body'),
        fileInput: $uploadButton.find('input'),
        dataType: 'json',
        url: '/track/upload',
        done: function(e, data) {
          var track = new OpenLayers.Editor.Models.Track(data.result);
          editor.showTrack(track);
          track.save();
        }
      });

      $li.append($uploadButton)
      $ul.append($li);
      this.$ul = $ul;
    }
    return this.$ul;
  },

  drawContentPane: function() {
    this.getUl();

  },


  createTrack: function() {
    this.editor.startEditing(new OpenLayers.Editor.Models.Track());
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.NewTrack'
});