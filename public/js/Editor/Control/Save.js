OpenLayers.Editor.Control.Save = OpenLayers.Class(OpenLayers.Control.Button, {

  editor: null,
  track: null,
  title: 'Sauvegarder',
  bootstrapIcon: 'icon-ok',
  boostrapIconOnly : true,

  $markup: null,

  beforeSave: null,
  afterSave: null,

  initialize: function(editor, track, beforeSave, afterSave) {

    this.beforeSave = beforeSave || null;
    this.afterSave = afterSave || null;

    this.editor = editor;
    this.track = track;
    OpenLayers.Control.Button.prototype.initialize.apply(this);
    this.trigger = this.triggerSave;

    track.events.register("change:hasChanges", this, this.onTrackChangeHasChanges);
  },

  configureMarkup: function($markup) {
    this.$markup = $markup;
    if (this.track.get('hasChanges') == true) {
      $markup.find('button').removeAttr('disabled');
    } else {
      $markup.find('button').attr('disabled', 'disabled');
    }

  },

  onTrackChangeHasChanges: function(evt) {
    if (evt.value == true) {
      this.$markup.find('button').removeAttr('disabled');
    } else {
      this.$markup.find('button').attr('disabled', 'disabled');
    }
  },

  triggerSave: function() {
    var beforeState = null;
    if (this.beforeSave !== null) {
      beforeState = this.beforeSave();
    }

    this.track.save(OpenLayers.Function.bind(function() {
      if (this.afterSave !== null) {
        this.afterSave(beforeState);
      }
    }, this));
  },

  CLASS_NAME: 'OpenLayers.Editor.Control.Save'
});