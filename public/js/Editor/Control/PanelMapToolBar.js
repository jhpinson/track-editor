OpenLayers.Editor.Control.PanelMapToolBar = OpenLayers.Class(OpenLayers.Editor.Control.Panel, {

  autoActivate: true,
  editor : null,
  zoom : null,
  layerSwitcher : null,
  myTracks : null,
  trackButtons : null,
  uploadButton : null,

  initialize: function(editor) {
    OpenLayers.Control.Panel.prototype.initialize.apply(this);
    this.editor = editor;
    var controls = [];

    this.zoom = new OpenLayers.Editor.Control.Zoom(editor);
    controls.push(this.zoom);

    this.layerSwitcher = new OpenLayers.Editor.Control.LayerSwitcher(editor);
    controls.push(this.layerSwitcher);

    this.myTracks = new OpenLayers.Editor.Control.MyTracks(editor);
    controls.push(this.myTracks);

    this.geoLoc = new OpenLayers.Editor.Control.GeoLoc(editor);
    controls.push(this.geoLoc);

    this.trackButtons = new OpenLayers.Editor.Control.NewTrack(editor);
    controls.push(this.trackButtons)

    /*this.uploadButton = new OpenLayers.Editor.Control.Upload(editor);
    controls.push(this.uploadButton);*/

    this.addControls(controls)




  },



  redraw: function() {
    for (var l = this.div.childNodes.length, i = l - 1; i >= 0; i--) {
      this.div.removeChild(this.div.childNodes[i]);
    }
    this.div.innerHTML = "";

    var $div = $(this.div);


    $div.append(this.myTracks.div);
    $div.append(this.trackButtons.div);
    //$div.append(this.uploadButton.div);
    $div.append(this.zoom.div);
    $div.append(this.layerSwitcher.div);
    $div.append(this.geoLoc.div);



  },

  CLASS_NAME: 'OpenLayers.Editor.Control.PanelMapToolBar'
});