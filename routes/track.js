
var fs = require('fs'), http = require('http'), querystring = require('querystring');
var tracks = require('../libs/models/tracks');

var save = function (req, response) {
  if (typeof(req.user) == 'undefined')  {
    response.statusCode = 401;
    response.end();
    return;
  }

  var data = req.body;

  if (data.owner === null) {
    data.owner = req.user['@rid'];
  }

  var res = {success : false, error : null, content : null}
  tracks.save(data, function (err, result) {
    if (err === null) {
        res.success = true
        res.content = result;
      } else {
        res.error = err;
      }
      response.send(res);
  });
}


var remove = function (req, response) {
  if (typeof(req.user) == 'undefined')  {
    response.statusCode = 401;
    response.end();
    return;
  }

  var data = req.body;
  tracks.remove(data, function (err) {
    response.send({success:(err === null)});
  })
}

var list = function(req, response){

  if (typeof(req.user) == 'undefined')  {
    response.statusCode = 401;
    response.end();
    return;
  }
  // owner : req.user['@rid']
  tracks.filter({owner : req.user['@rid']}, function (err, results) {
    response.send(results);
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

var upload = function (req, response) {

  fs.readFile(req.files.files[0].path, 'utf-8', function (err, data) {
    response.send({title : req.files.files[0].name, gpx : data});
  });
}

exports.configure = function (app) {
  app.post('/track', save);
  app.get('/track', list);
  app.post('/track/remove', remove);
  app.get('/track/:id/gpx', gpx);
  app.post('/track/upload', upload);
}
