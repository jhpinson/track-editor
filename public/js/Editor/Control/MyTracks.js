OpenLayers.Editor.Control.MyTracks = OpenLayers.Class(OpenLayers.Editor.Control.ButtonPopOver, {
  buttonLabel : 'Mes parcours',
  buttonClass : 'btn-primary',

  initialize: function(editor, options) {
    OpenLayers.Editor.Control.ButtonPopOver.prototype.initialize.apply(this, [editor]);
  },

  drawContentPane: function() {
    var $el = $(this.div),
      $ul = $el.find('ul'),
      editor = this.editor,
      self = this;

    $ul.empty();
    OpenLayers.Editor.TrackCollection.getInstance().tracks.forEach(function(track) {


      var $li;

      var trackShown = editor.isTrackShown(track);
      var trackEditing = editor.isEditingTrack(track);

      if (trackEditing) {
        $li = $('<li class="active"><span class="title">' + track.get('title') + '</span></li>');
        $ul.append($li);
        return;
      }

      $li = $('<li><span class="title">' + track.get('title') + '</span></li>');
      $ul.append($li);

      var $actions = $('<div></div>');
      $li.append($actions);

      var $btnShowHide = $('<a href="#none" data-role="visibility" data-role-value="' + (trackShown ? 'visible' : 'hidden') + '" >' + (trackShown ? 'hide' : 'show') + '</a>');
      $actions.append($btnShowHide);
      $btnShowHide.click(function(evt) {
        evt.preventDefault();
        if ($(this).attr('data-role-value') == 'visible') {
          $(this).attr('data-role-value', 'hidden');
          $(this).html('show');
          //getDataExtent
          //editor.map.removeLayer(track.getVectorLayer());
          editor.hideTrack(track);
        } else {
          $(this).attr('data-role-value', 'visible');
          $(this).html('hide');
          editor.showTrack(track);
        }
      });

      var $btnModify = $('<a href="#none" data-role="modify" data-role-value="false" >modifier</a>');
      $actions.append($btnModify);
      $btnModify.click(function(evt) {
        evt.preventDefault();
        if ($(this).attr('data-role-value') == 'true') {
          return;
        }
        $(this).attr('data-role-value', 'true');
        editor.startEditing(track);
        self.drawContentPane();
      });

      var $btnRemove = $('<a href="#none" data-role="remove" >remove</a>');
      $actions.append($btnRemove);
      $btnRemove.click(function(evt) {
        evt.preventDefault();
        track.remove(function(err, track) {
          if (err !== null) {
            OpenLayers.Editor.Control.Growl.getInstance().error('La suppression du parcours a échoué : ' + err)
          } else {
            OpenLayers.Editor.Control.Growl.getInstance().success('Le parcours a été supprimé');
            $li.fadeOut(200, function() {
              $li.remove();
            });
          }
        });


      });



    });

    if ($ul.is(':empty')) {
      $ul.append('<li>Aucun parcours dans la bibliothèque</li>')
    }
  },


  CLASS_NAME: 'OpenLayers.Editor.Control.MyTracks'
});