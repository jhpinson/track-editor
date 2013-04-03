OpenLayers.Editor.Control.MyTracks = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  editor: null,
  closeTimeout: null,

  initialize: function(editor, options) {
    this.editor = editor;
    this.title = null;
    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor]);
    this.trigger = this.showContentPane;
  },



  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]);
    var $div = $(div);

    var $button = $('<button class="btn btn-mini btn-primary" type="button">Mes parcours</button>')
    $div.append($button);

    var $ul = $('<ul style="display:none" class="well well-small"></ul>');
    $div.append($ul);

    var self = this;
    $button.click(function(evt) {
      evt.preventDefault();
      self.showContentPane();
    });

    $div.bind('mouseover', function() {
      if (self.closeTimeout !== null) {
        clearTimeout(self.closeTimeout);
        self.closeTimeout = null;
      }
      if (!$ul.is(':visible')) {
        self.showContentPane();
      }
    });

    $div.bind('mouseout', function(evt) {
      if (self.closeTimeout !== null) {
        clearTimeout(self.closeTimeout);
        self.closeTimeout = null;
      }

      self.closeTimeout = setTimeout(function() {
        if (self.closeTimeout !== null) {
          self.hideContentPane();
          self.closeTimeout = null;
        }
      }, 500);

    });

    return div;
  },

  onShowInlineHTML: function(sender) {
    if (sender != this) {
      this.hideContentPane(true);
    }
  },

  hideContentPane: function(force) {

    var $el = $(this.div),
      $ul = $el.find('ul');

    if (force) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
      $ul.hide();
      return;
    }


    if (this.closeTimeout !== null) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    $ul.fadeOut(200);
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
        OpenLayers.Editor.Control.Mask.getInstance().activate();
        track.remove(function(err, track) {
          OpenLayers.Editor.Control.Mask.getInstance().deactivate();
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

  showContentPane: function() {
    var $el = $(this.div),
      $ul = $el.find('ul'),
      editor = this.editor;

    editor.events.triggerEvent('showInlineHTML', this);

    this.drawContentPane();

    $ul.fadeIn(200);

  },

  CLASS_NAME: 'OpenLayers.Editor.Control.MyTracks'
});