OpenLayers.Editor = OpenLayers.Class({


  activeEditorPanel : null,
  createTrackButton : null,
  events : null,

  initialize : function (map, user) {
    this.map = map;
    this.map.editor = this;

    this.events = new OpenLayers.Events(this);

    OpenLayers.Editor.TrackCollection.getInstance();

    this.createTrackButton = new OpenLayers.Editor.Control.NewTrack(this);
    this.map.addControl(this.createTrackButton);
    this.createTrackButton.activate();

    var myTracks = new OpenLayers.Editor.Control.MyTracks(this);
    this.map.addControl(myTracks);
    myTracks.activate();

    var layerSwitcher = new OpenLayers.Editor.Control.LayerSwitcher(this);
    this.map.addControl(layerSwitcher);
    layerSwitcher.activate();

    var uploadButton = new OpenLayers.Editor.Control.Upload(this);
    this.map.addControl(uploadButton);
    uploadButton.activate();

    var growl = OpenLayers.Editor.Control.Growl.getInstance();
    this.map.addControl(growl);
    growl.activate();

    this.map.addControl(OpenLayers.Editor.Control.Mask.getInstance());

  },

  showTrack :function (track) {
    if (this.map.layers.indexOf(track.getVectorLayer()) == -1) {
      if (this.activeEditorPanel !== null) {
        // add to tragets
        this.activeEditorPanel.snapControl.addTargetLayer(track.getVectorLayer());
      }

      this.map.addLayer(track.getVectorLayer());
      var bounds = track.getVectorLayer().getDataExtent();
      if (bounds !== null) {
        this.map.zoomToExtent(bounds);
      }
    }
  },

  hideTrack : function (track) {
      this.map.removeLayer(track.getVectorLayer());
      if (this.activeEditorPanel !== null) {
        // remove from tragets
        this.activeEditorPanel.snapControl.removeTargetLayer(track.getVectorLayer());
      }
  },

  isEditingTrack : function (track) {
    return this.activeEditorPanel !== null && this.activeEditorPanel.track === track;
  },

  isTrackShown : function (track) {
    return track.hasVectorLayerLoaded() && this.map.layers.indexOf(track.getVectorLayer()) !== -1;
  },

  startEditing : function (track) {

        if (this.activeEditorPanel !== null) {
          this.stopEditing();
        }

        this.createTrackButton.deactivate();
        this.activeEditorPanel = new OpenLayers.Editor.Control.PanelEditTrack(this, track);



    },



    stopEditing : function () {

      var track = this.activeEditorPanel.track;

      this.activeEditorPanel.deactivate();
      this.activeEditorPanel.destroy();
      this.activeEditorPanel = null;

      this.createTrackButton.activate();
    },

    CLASS_NAME: 'OpenLayers.Editor'

});

OpenLayers.Editor.Control = OpenLayers.Class(OpenLayers.Control, {

    initialize: function (options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    CLASS_NAME: 'OpenLayers.Editor.Control'
});
