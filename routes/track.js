
var fs = require('fs'), http = require('http'), querystring = require('querystring');
var tracks = require('../libs/models/tracks');

var save = function (req, response) {
  if (typeof(req.user) == 'undefined')  {
    response.statusCode = 401;
    response.end();
    return;
  }

  var data = req.body;
  var res = {success : false, error : null, content : null}
  tracks.save(data, function (err, result) {
    if (err === null) {
        res.success = true
        res.content = {'@rid' :  result['@rid']};
      } else {
        res.error = err;
      }
      response.end(JSON.stringify(res));
  });
}


var remove = function (req, res) {
  if (typeof(req.user) == 'undefined')  {
    response.statusCode = 401;
    response.end();
    return;
  }

  var data = req.body;
  tracks.remove(data, function (err) {
    res.end(JSON.stringify({success:(err === null)}));
  })
}

var list = function(req, res){

  if (typeof(req.user) == 'undefined')  {
    response.statusCode = 401;
    response.end();
    return;
  }

  tracks.filter({}, function (err, results) {
    res.end(JSON.stringify(results));
  })
};

var gpx = function (req, res) {
  res.end('TODO');
  /*
  database.db.command("SELECT gpx from #10:" + req.params.id, function (err, results) {
    if (err === null) {
      if (results.length == 1) {
        res.end(results[0].gpx);
      } else {
        res.statusCode = 404;
        res.end();
      }

    } else{
      res.statusCode = 500;
      res.end('Something went wrong');
    }

    });*/
}

var upload = function (req, res) {

  fs.readFile(req.files.files[0].path, 'utf-8', function (err, data) {
    res.end(JSON.stringify({title : req.files.files[0].name, gpx : data}));
  });
}

exports.configure = function (app) {
  app.post('/track', save);
  app.get('/track', list);
  app.post('/track/remove', remove);
  app.get('/track/:id/gpx', gpx);
  app.post('/track/upload', upload);
}
