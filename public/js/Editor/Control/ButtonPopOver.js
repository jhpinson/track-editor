OpenLayers.Editor.Control.ButtonPopOver = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  closeTimeout: null,
  buttonLabel : null,
  buttonClass : 'btn-info',

  initialize: function(editor, options) {
    this.title = null;
    this.editor = editor;
    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor]);
    this.trigger = this.showContentPane;

  },



  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]);
    var $div = $(div);

    var $button = $('<button class="btn btn-mini '+ this.buttonClass +'" type="button">'+this.buttonLabel+'</button>')
    $div.append($button);
    $button.attr("title", '');
    this.$button = $button;

    var $ul = $('<ul style="display:none; position:absolute" class="well well-small nav"></ul>');
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

  },


  showContentPane: function() {
    var editor = this.editor,
      $el = $(this.div),
      $ul = $el.find('ul'),
      $button = $el.children('button');

    editor.events.triggerEvent('showInlineHTML', this);

    var position = $button.offset();
    position.top += $button.height() / 2;
    position.left -= 8;
    $ul.css(position);

    this.drawContentPane();

    $ul.fadeIn(200);

  },

  CLASS_NAME: 'OpenLayers.Editor.Control.ButtonPopOver'
});