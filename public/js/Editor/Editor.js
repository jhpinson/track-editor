OpenLayers.Editor = OpenLayers.Class({

  toolbox : null,

  activeEditorPanel : null,
  createTrackButton : null,
  events : null,
  map : null,

  authenticatedUser : null,

  initialize : function (map, user) {
    this.map = map;
    this.map.editor = this;

    this.events = new OpenLayers.Events(this);


    this.setUser(new OpenLayers.Editor.Models.User(user))

  },

  setUser : function (user) {

    this.authenticatedUser = user;

    OpenLayers.Editor.TrackCollection.getInstance();


    this.toolbox = new OpenLayers.Editor.Control.ToolBox(this);
    this.map.addControl(this.toolbox);
    this.toolbox.activate();

    var toolbar = new OpenLayers.Editor.Control.PanelMapToolBar(this);
    this.map.addControl(toolbar);
    toolbar.activate();

    var growl = OpenLayers.Editor.Control.Growl.getInstance();
    this.map.addControl(growl);
    growl.activate();
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
    track = track || null;
    return this.toolbox.isEditingTrack(track);
    //return this.activeEditorPanel !== null && this.activeEditorPanel.track === track;
  },

  isTrackShown : function (track) {
    return track.hasVectorLayerLoaded() && this.map.layers.indexOf(track.getVectorLayer()) !== -1;
  },

  startEditing : function (track) {

    this.events.triggerEvent('startEditing', track);

    },



    stopEditing : function () {

      this.events.triggerEvent('stopEditing');

    },

    CLASS_NAME: 'OpenLayers.Editor'

});


