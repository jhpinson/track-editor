OpenLayers.Editor.TrackCollection = OpenLayers.Class({
  tracks : null,
  initialize : function () {
    this.tracks = [];
  },

  load : function () {
    /*OpenLayers.Editor.localStorage.keys(/^track_/).forEach(function (key) {
        var data = OpenLayers.Editor.localStorage.get(key);
        data.localStorageId = key;
        new OpenLayers.Editor.Track(data);
    });*/

    $.ajax({
      url: "/track",
      type: 'GET',
      context: this,
      contentType: 'application/json; charset=UTF-8'
    }).success(function(results) {
      results.forEach(function (data) {
        new OpenLayers.Editor.Models.Track(data);
      })
    });

  },

  add : function (track) {
    this.tracks.push(track);
  },

  remove : function (track) {
    var index = this.tracks.indexOf(track);
    if (index >= 0) {
      this.tracks.splice(index,1);
    }
  },

  CLASS_NAME: 'OpenLayers.Editor.TrackCollection'

});

OpenLayers.Editor.TrackCollection.instance = null,
OpenLayers.Editor.TrackCollection.getInstance =  function () {
    if (OpenLayers.Editor.TrackCollection.instance == null) {
      OpenLayers.Editor.TrackCollection.instance = new OpenLayers.Editor.TrackCollection();
      OpenLayers.Editor.TrackCollection.instance.load();
    }
    return OpenLayers.Editor.TrackCollection.instance;
  }