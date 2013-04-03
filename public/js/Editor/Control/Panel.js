OpenLayers.Editor.Control.Panel = OpenLayers.Class(OpenLayers.Control.Panel, {

  __activeControl : null,

  draw: function(px) {
    var div = OpenLayers.Control.Panel.prototype.draw.apply(this, [px]);
    $(div).addClass('well well-small');
    return div;
  },


  /**
   * APIMethod: addControls
   * To build a toolbar, you add a set of controls to it. addControls
   * lets you add a single control or a list of controls to the
   * Control Panel.
   *
   * Parameters:
   * controls - {<OpenLayers.Control>} Controls to add in the panel.
   */
  addControls: function(controls) {
    if (!(OpenLayers.Util.isArray(controls))) {
      controls = [controls];
    }
    this.controls = this.controls.concat(controls);

    for (var i = 0, len = controls.length; i < len; i++) {

      var control = controls[i],
        element;
      if (control.type == OpenLayers.Control.TYPE_INLINE_HTML) {
        element = control.draw();

      } else {
        element = this.createControlMarkup(control);
        OpenLayers.Element.addClass(element,
        control.displayClass + "ItemInactive");
        OpenLayers.Element.addClass(element, "olButton");
        if (control.title != "" && !element.title) {
          element.title = control.title;
        }
      }


      control.panel_div = element;
    }

    if (this.map) { // map.addControl() has already been called on the panel
      this.addControlsToMap(controls);
      this.redraw();
    }
  },

  createControlMarkup: function(control) {
    var $markup = $('<div><button class="btn btn-mini" type="button" data-toggle="button"> ' + (control.bootstrapIcon ? ' <i class="' + control.bootstrapIcon + '"></i>' : '') + ' ' + control.title + '</button></div>');

    if (control.configureMarkup) {
      control.configureMarkup($markup);
    }

    return $markup[0];
  },

  /**
   * Method: addControlsToMap
   * Only for internal use in draw() and addControls() methods.
   *
   * Parameters:
   * controls - {Array(<OpenLayers.Control>)} Controls to add into map.
   */
  addControlsToMap: function(controls) {
    var control;
    for (var i = 0, len = controls.length; i < len; i++) {
      control = controls[i];
      if (control.type == OpenLayers.Control.TYPE_INLINE_HTML) continue;
      if (control.autoActivate === true) {
        control.autoActivate = false;
        this.map.addControl(control);
        control.autoActivate = true;
      } else {
        this.map.addControl(control);
        control.deactivate();
      }
      control.events.on({
        activate: this.iconOn,
        deactivate: this.iconOff
      });
    }
  },

  activateControl: function(control) {

    var res = OpenLayers.Control.Panel.prototype.activateControl.apply(this, [control]);
    if (res !== false) {

      if (this.__activeControl !== null) {
        $(this.__activeControl.panel_div).find('button').removeClass('active');
      }

      if (control.active) {
          $(control.panel_div).find('button').addClass('active');
          this.__activeControl = control;
      }

    }

    return res;

  },

  CLASS_NAME: 'OpenLayers.Editor.Control.Panel'

});

OpenLayers.Control.TYPE_INLINE_HTML = 4;