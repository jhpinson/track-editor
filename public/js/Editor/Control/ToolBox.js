OpenLayers.Editor.Control.ToolBox = OpenLayers.Class(OpenLayers.Editor.Control.Panel, {
  /*
   * {boolean} Whether to show by default. Leave value FALSE and show by starting editor's edit mode.
   */
  autoActivate: false,
  createTrackButton: null,
  editingPanel: null,
  editor : null,

  /**
   * Constructor: OpenLayers.Editor.Control.EditorPanel
   * Create an editing toolbar for a given editor.
   *
   * Parameters:
   * editor - {<OpenLayers.Editor>}
   * options - {Object}
   */
  initialize: function(editor) {
    OpenLayers.Control.Panel.prototype.initialize.apply(this);
    this.editor = editor;
    var controls = [];



    this.addControls(controls)

    editor.events.register('startEditing', this, this.startEditing);
    editor.events.register('stopEditing', this, this.stopEditing);

  },

  isEditingTrack : function (track) {
    return this.editingPanel !== null && (track === null || this.editingPanel.track === track);
  },

  stopEditing: function() {

    var editingPanel = this.editingPanel;
    this.editingPanel = null;
    editingPanel.deactivate();
    editingPanel.destroy();

    //this.createTrackButton.activate();
    this.redraw();
  },

  startEditing: function(track) {
    if (this.editingPanel !== null) {
      this.stopEditing();
    }

    //this.createTrackButton.deactivate();
    this.editingPanel = new OpenLayers.Editor.Control.PanelEditTrack(this.editor, track);
    this.addControls([this.editingPanel]);

    this.redraw();

  },

  draw: function() {
    OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
    $(this.div).addClass('toolbox');
    return this.div;
  },

  redraw: function() {
    for (var l = this.div.childNodes.length, i = l - 1; i >= 0; i--) {
      this.div.removeChild(this.div.childNodes[i]);
    }
    this.div.innerHTML = "";

    var $div = $(this.div);


    if (this.editingPanel !== null) {
      $div.append(this.editingPanel.div);
    }


  },

  CLASS_NAME: 'OpenLayers.Editor.Control.ToolBox'
});