(function() {

    var scripts = document.getElementsByTagName("script");
    var src = scripts[scripts.length - 1].src;
    var path = src.substring(0, src.lastIndexOf("/") + 1);

    var files = [

        'Geometry/Point.js',
        'Editor.js',
        'GPX.js',

        'Models/__init__.js',
        'Models/Base.js',
        'Models/User.js',
        'Models/Track.js',

        //'LocalStorage.js',

        'TrackCollection.js',

        'Control/__init__.js',
        'Control/Panel.js',
        'Control/InlineHTML.js',
        'Control/Separator.js',
        'Control/EditorPanel.js',
        'Control/DrawPath.js',
        'Control/StopEditing.js',
        'Control/NewTrack.js',
        'Control/MyTracks.js',
        'Control/LayerSwitcher.js',
        'Control/PanelEditTrack.js',
        'Control/TrackTitle.js',
        'Control/ColorPicker.js',
        'Control/Save.js',
        'Control/Upload.js',
        'Control/Growl.js',
        'Control/Mask.js',

    ];

    // Load translations if HTML page defines a language
    var language = document.documentElement.getAttribute('lang');
    if(language){
        files.unshift('Editor/Lang/'+language+'.js');
        if(OpenLayers.Lang[language]===undefined){
            OpenLayers.Lang[language] = {};
        }
    }

    var tags = new Array(files.length);

    var el = document.getElementsByTagName("head").length ?
  document.getElementsByTagName("head")[0] :
  document.body;

    for(var i=0, len=files.length; i<len; i++) {
  tags[i] = "<script src='" + path + files[i] + "'></script>";
    }
    document.write(tags.join(""));

})();
