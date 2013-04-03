OpenLayers.Editor.Control.LayerSwitcher = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  editor: null,
  closeTimeout: null,
  $ul: null,

  initialize: function(editor, options) {
    this.editor = editor;
    this.title = null;
    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor]);
    this.trigger = this.showContentPane;

  },



  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]);
    var $div = $(div);

    var $button = $('<button class="btn btn-mini btn-primary" type="button">Fonds de Carte</button>')
    $div.append($button);
    $button.attr("title", '');

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

    $div.bind('mouseout', function() {
      if (self.closeTimeout !== null) {
        clearTimeout(self.closeTimeout);
        self.closeTimeout = null;
      }

      self.closeTimeout = setTimeout(function() {
        if (self.closeTimeout !== null) {
          self.hideContentPane();
          self.closeTimeout = null;
        }
      }, 200);

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


  showContentPane: function() {
    var editor = this.editor,
      $el = $(this.div),
      $ul = $el.find('ul');

    editor.events.triggerEvent('showInlineHTML', this);


    this.drawContentPane();

    $ul.fadeIn(200);

  },

  CLASS_NAME: 'OpenLayers.Editor.Control.LayerSwitcher'
});