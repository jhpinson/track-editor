OpenLayers.Editor.Control.PanelEditTrack = OpenLayers.Class(OpenLayers.Editor.Control.Panel, {

  editor: null,
  layer: null,
  track: null,

  trackTitle: null,
  colorPicker : null,

  saveControl: null,
  quitControl: null,
  drawControl: null,
  modifyControl: null,
  snapControl: null,

  stats : null,

  initialize: function(editor, track) {
    this.editor = editor;

    this.layer = track.getVectorLayer();
    this.track = track;

    editor.showTrack(track);

    // todo : recupperer tous les layers visible et les ajouter au snap control
    this.snapControl = new OpenLayers.Control.Snapping({
      layer: this.layer,
      targets: [{
        layer: this.layer
      }]
    });
    this.snapControl.activate();
    editor.map.addControl(this.snapControl);

    this.layer.events.on({
      "featureadded": this.onFeatureUpdate,
      "afterfeaturemodified": this.onFeatureUpdate,
      "featuremodified": this.onFeatureUpdate,
      //"sketchcomplete": this.triggerUpdateFeature,
      scope: this
    });

    OpenLayers.Editor.Control.Panel.prototype.initialize.apply(this);

    var controls = [];

    this.trackTitle = new OpenLayers.Editor.Control.TrackTitle(editor, track);
    controls.push(this.trackTitle);

    this.colorPicker = new OpenLayers.Editor.Control.ColorPicker(editor, track);
    controls.push(this.colorPicker);


    this.navigationControl = new OpenLayers.Control.Navigation({
      title: 'Naviguer',
      bootstrapIcon: 'icon-move',
      boostrapIconOnly : true
    });
    controls.push(this.navigationControl);

    this.drawControl = new OpenLayers.Editor.Control.DrawPath(this.layer)
    controls.push(this.drawControl);

    this.modifyControl = new OpenLayers.Control.ModifyFeature(this.layer, {
      title: 'Modifier un segment',
      bootstrapIcon: 'icon-edit',
      boostrapIconOnly : true
    });
    controls.push(this.modifyControl);

    this.saveControl = new OpenLayers.Editor.Control.Save(editor, track, OpenLayers.Function.bind(this.beforeSave, this), OpenLayers.Function.bind(this.afterSave, this));
    controls.push(this.saveControl);

    this.quitControl = new OpenLayers.Editor.Control.StopEditing(editor, track);
    controls.push(this.quitControl);

    this.stats = new OpenLayers.Editor.Control.Stats(editor, track);
    controls.push(this.stats);

    this.addControls(controls);
    this.editor.map.addControl(this);
    this.activate();

  },

  draw: function() {
    OpenLayers.Editor.Control.Panel.prototype.draw.apply(this, arguments);
    $(this.div).removeAttr('style');
    return this.div;
  },

  redraw: function() {
    for (var l = this.div.childNodes.length, i = l - 1; i >= 0; i--) {
      this.div.removeChild(this.div.childNodes[i]);
    }
    this.div.innerHTML = "";

    var $div = $(this.div);

    var $titleContainer = $('<div class="title-color"></div>');
    $div.append($titleContainer);
    $titleContainer.append(this.colorPicker.panel_div);
    $titleContainer.append(this.trackTitle.panel_div);


    var $toolsContainer = $('<div class="tools"></div>');
    $div.append($toolsContainer);
    $toolsContainer.append(this.navigationControl.panel_div);
    $toolsContainer.append(this.drawControl.panel_div);
    $toolsContainer.append(this.modifyControl.panel_div);
    $toolsContainer.append(this.saveControl.panel_div);
    $toolsContainer.append(this.quitControl.panel_div);

    console.debug(this.stats.div)
    $div.append(this.stats.div);

  },


  __stopFeatureUpdate: false,
  beforeSave: function() {
    var control = null;
    if (this.drawControl.active === true) {
      control = this.drawControl;
    } else if (this.modifyControl.active === true) {
      control = this.modifyControl;
    } else if (this.navigationControl.active === true) {
      control = this.navigationControl;
    }

    this.__stopFeatureUpdate = true;
    this.drawControl.deactivate();
    this.modifyControl.deactivate();
    this.__stopFeatureUpdate = false;

    return control;
  },

  afterSave: function(control) {
    if (control !== null) {
      control.activate();
      this.activateControl(control);
    }

  },

  onFeatureUpdate: function() {
    if (this.__stopFeatureUpdate === true) {
      return;
    }
    this.track.refreshMetaData(function(err, track) {}, false);
  },

  destroy: function() {

    this.drawControl.deactivate();
    this.drawControl.destroy();
    this.drawControl = null;

    this.modifyControl.deactivate();
    this.modifyControl.destroy();
    this.modifyControl = null;


    this.snapControl.deactivate();
    this.editor.map.removeControl(this.snapControl);
    this.snapControl.destroy();
    this.snapControl = null;

    this.layer.events.un({
      "featureadded": this.triggerSave,
      "afterfeaturemodified": this.triggerSave,
      "sketchcomplete": this.triggerSave,
      scope: this
    });

    OpenLayers.Editor.Control.Panel.prototype.destroy.apply(this);
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.PanelEditTrack'

});