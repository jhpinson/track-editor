OpenLayers.Editor.Control.PanelEditTrack = OpenLayers.Class(OpenLayers.Editor.Control.Panel, {

  editor: null,
  layer : null,
  track : null,

  trackTitle : null,
  drawControl : null,
  modifyControl : null,
  snapControl : null,

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

    controls.push(new OpenLayers.Editor.Control.ColorPicker(editor, track));

    controls.push(new OpenLayers.Editor.Control.Separator());

    this.navigationControl = new OpenLayers.Control.Navigation({title : 'Naviguer', bootstrapIcon : 'icon-move'});
    controls.push(this.navigationControl);

    this.drawControl = new OpenLayers.Editor.Control.DrawPath(this.layer)
    controls.push(this.drawControl);

    this.modifyControl = new OpenLayers.Control.ModifyFeature(this.layer, {
      title: 'Modifier un segment',
      bootstrapIcon:  'icon-edit'
    });
    controls.push(this.modifyControl);


    controls.push(new OpenLayers.Editor.Control.Save(editor, track, OpenLayers.Function.bind(this.beforeSave, this), OpenLayers.Function.bind(this.afterSave, this)));
    controls.push(new OpenLayers.Editor.Control.StopEditing(editor, track));


    this.addControls(controls);
    this.editor.map.addControl(this);
    this.activate();

  },

  __stopFeatureUpdate : false,
  beforeSave : function () {
      var control = null;
      if (this.drawControl.active === true) {
        control = this.drawControl;
      } else if (this.modifyControl.active === true) {
        control = this.modifyControl;
      } else if (this.navigationControl.active===true) {
        control = this.navigationControl;
      }

      this.__stopFeatureUpdate = true;
      this.drawControl.deactivate();
      this.modifyControl.deactivate();
      this.__stopFeatureUpdate = false;

      return control;
  },

  afterSave : function (control) {
    if (control !== null) {
      control.activate();
      this.activateControl(control);
    }

  },

  onFeatureUpdate : function () {
      if (this.__stopFeatureUpdate === true) {
        return;
      }
      this.track.refreshMetaData(function (err, track) {
      }, false);
    },

  destroy : function () {

      this.drawControl.deactivate();
      this.drawControl.destroy();
      this.drawControl =null;

      this.modifyControl.deactivate();
      this.modifyControl.destroy();
      this.modifyControl =null;


      this.snapControl.deactivate();
      this.editor.map.removeControl(this.snapControl);
      this.snapControl.destroy();
      this.snapControl = null;

      this.layer.events.un({
                        "featureadded": this.triggerSave,
                        "afterfeaturemodified": this.triggerSave,
                        "sketchcomplete" : this.triggerSave,
                        scope: this
                    });

      OpenLayers.Editor.Control.Panel.prototype.destroy.apply(this);
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.PanelEditTrack'

});