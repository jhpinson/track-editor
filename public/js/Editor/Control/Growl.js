OpenLayers.Editor.Control.Growl = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {



  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]);
    var $div = $(div);
    $div.addClass('notifications bottom-right');
    return div;
  },

  success: function(message) {
    return
    Messenger().post({
      message: message,
      type: 'success',
      hideAfter: 5,
      showCloseButton: true
    });
    return
    $(this.div).notify({
      message: {
        text: message
      },
      type: 'success',

    }).show();
  },

  error: function(message) {
    Messenger().post({
      message: message,
      type: 'error',
      showCloseButton: true
    });
    return;

    $(this.div).notify({
      message: {
        text: message
      },
      type: 'error',
      fadeOut: {
        enabled: false
      }
    }).show();
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.Growl'

});

OpenLayers.Editor.Control.Growl.instance = null,
OpenLayers.Editor.Control.Growl.getInstance = function() {
  if (OpenLayers.Editor.Control.Growl.instance == null) {
    OpenLayers.Editor.Control.Growl.instance = new OpenLayers.Editor.Control.Growl();
  }
  return OpenLayers.Editor.Control.Growl.instance;
}