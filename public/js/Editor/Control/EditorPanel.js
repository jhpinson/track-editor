OpenLayers.Editor.Control.EditorPanel = OpenLayers.Class(OpenLayers.Control.Panel, {
    /*
     * {boolean} Whether to show by default. Leave value FALSE and show by starting editor's edit mode.
     */
    autoActivate: false,

    /**
     * Constructor: OpenLayers.Editor.Control.EditorPanel
     * Create an editing toolbar for a given editor.
     *
     * Parameters:
     * editor - {<OpenLayers.Editor>}
     * options - {Object}
     */
    initialize: function (editor, options) {
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
    },




    draw: function() {
        OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        if (!this.active) {
            this.div.style.display = 'none';
        }
        return this.div;
    },

    redraw: function(){
        if (!this.active) {
            this.div.style.display = 'none';
        }

        OpenLayers.Control.Panel.prototype.redraw.apply(this, arguments);

        if (this.active) {
            this.div.style.display = '';
        }
    },

    CLASS_NAME: 'OpenLayers.Editor.Control.EditorPanel'
});