OpenLayers.Editor.Control.Stats = OpenLayers.Class(OpenLayers.Editor.Control.InlineHTML, {

  editor: null,
  track: null,


  initialize: function(editor, track, options) {
    this.editor = editor;
    this.track = track;

    OpenLayers.Editor.Control.InlineHTML.prototype.initialize.apply(this, [editor, options]);

  },


  draw: function(px) {
    var div = OpenLayers.Editor.Control.InlineHTML.prototype.draw.apply(this, [px]),
      track = this.track, editor = this.editor, self = this;
    var $div = $(div);

    var $distanceContainer = $('<div class="distance"> km</div>');
    var $distance = $('<span>'+this.track.get('len')+'</span>');
    $distanceContainer.prepend($distance);
    $distanceContainer.prepend('<span class="label">Distance</span>');
    $div.append($distanceContainer);

    var $dplusContainer = $('<div class="distance"> m</div>');
    var $dplus = $('<span>'+this.track.get('dplus')+'</span>');
    $dplusContainer.prepend($dplus);
    $dplusContainer.prepend('<span class="label">D+</span>');
    $div.append($dplusContainer);

    var $dminusContainer = $('<div class="distance"> m</div>');
    var $dminus = $('<span>'+this.track.get('dplus')+'</span>');
    $dminusContainer.prepend($dminus);
    $dminusContainer.prepend('<span class="label">D-</span>');
    $div.append($dminusContainer);

    this.track.events.register('change:len', this, function (event) {
      $distance.text(event.value);
    });

    this.track.events.register('change:dplus', this, function (event) {
      $dplus.text(event.value);
    });

    this.track.events.register('change:dminus', this, function (event) {
      $dminus.text(event.value);
    });

    return div;
  },




  CLASS_NAME: 'OpenLayers.Editor.Control.Stats'

});