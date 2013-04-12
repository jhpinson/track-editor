OpenLayers.Editor.Control.TrackTitle = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  editor: null,
  track : null,
  $title : null,

  initialize: function(editor, track, options) {
    this.editor = editor;
    this.track = track;

    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor, options]);

  },

  onShowInlineHTML : function (sender) {
      if (sender != this) {
        this.$title.editable('hide');

      }
    },

  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]), track = this.track, editor=this.editor, self=this;
    var $div = $(div);
    var $title = $('<a class="title" id="title" data-original-title="Titre" title="Cliquer pour modifier le titre">'+ this.track.get('title') +'</a>');
    this.$title = $title;
    $div.append($title);
    $title.editable({placement : 'bottom', unsavedclass : null});
    $title.on('shown', function() {
      editor.events.triggerEvent('showInlineHTML', self);
    });
    $title.on('hidden', function(e, reason) {
      if (reason == 'save') {
        track.set('title',$title.editable('getValue').title);
        //track.save()
      }
    });

    return div;
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.TrackTitle'

});