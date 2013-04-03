OpenLayers.Editor.Control.InlineHTML = OpenLayers.Class(OpenLayers.Control, {

  type: OpenLayers.Control.TYPE_INLINE_HTML,

  initialize: function(editor) {
    OpenLayers.Control.prototype.initialize.apply(this);
    this.displayClass += ' inline-html-control';
    if (editor) {
      editor.events.register('showInlineHTML', this, this.onShowInlineHTML);
    }
  },

  onShowInlineHTML : function () {

  },

  draw: function(px) {
    var div = OpenLayers.Control.prototype.draw.apply(this, [px]);
    $(div).removeAttr('style');
    this.registerEvents();
    return div;
  },

  activate : function () {
    $(this.div).fadeIn(200);
    OpenLayers.Control.prototype.activate.apply(this);
  },

  deactivate : function () {
    $(this.div).fadeOut(200);
    OpenLayers.Control.prototype.deactivate.apply(this);
  },

  registerEvents: function() {
    this.events = new OpenLayers.Events(this, this.div, null, true);


    this.events.on({
      "mousedown": this.onmousedown,
      "mousemove": this.onmousemove,
      "mouseup": this.onmouseup,
      "click": this.onclick,
      "mouseout": this.onmouseout,
      "dblclick": this.ondblclick,
      scope: this
    });

  },
  onmousedown: function(evt) {
    this.mousedown = true;
    OpenLayers.Event.stop(evt, true);
  },

  /**
   * Method: onmousemove
   * If the drag was started within the popup, then
   *   do not propagate the mousemove (but do so safely
   *   so that user can select text inside)
   *
   * Parameters:
   * evt - {Event}
   */
  onmousemove: function(evt) {
    if (this.mousedown) {
      OpenLayers.Event.stop(evt, true);
    }
  },

  /**
   * Method: onmouseup
   * When mouse comes up within the popup, after going down
   *   in it, reset the flag, and then (once again) do not
   *   propagate the event, but do so safely so that user can
   *   select text inside
   *
   * Parameters:
   * evt - {Event}
   */
  onmouseup: function(evt) {
    if (this.mousedown) {
      this.mousedown = false;
      OpenLayers.Event.stop(evt, true);
    }
  },

  /**
   * Method: onclick
   * Ignore clicks, but allowing default browser handling
   *
   * Parameters:
   * evt - {Event}
   */
  onclick: function(evt) {
    OpenLayers.Event.stop(evt, true);
  },

  /**
   * Method: onmouseout
   * When mouse goes out of the popup set the flag to false so that
   *   if they let go and then drag back in, we won't be confused.
   *
   * Parameters:
   * evt - {Event}
   */
  onmouseout: function(evt) {
    this.mousedown = false;
  },

  /**
   * Method: ondblclick
   * Ignore double-clicks, but allowing default browser handling
   *
   * Parameters:
   * evt - {Event}
   */
  ondblclick: function(evt) {
    OpenLayers.Event.stop(evt, true);
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.InlineHTML'

});