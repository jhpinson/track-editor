var users = require('../libs/models/users');


var current = function(req, res) {

  if (typeof(req.user) !== 'undefined') {
    data = req.user;
  } else {
    data = null;
  }
  res.end(JSON.stringify(data));
};


var save = function(req, response) {

  var data = req.body;
  var res = {
    success: false,
    error: null,
    content: null
  }
  users.save(data, function(err, result) {
    if (err === null) {
      res.success = true
      res.content = {
        '@rid': result['@rid']
      };
    } else {
      res.error = err;
    }
    response.end(JSON.stringify(res));
  })
}

var register = function(req, response) {
  var data = req.body;
  var res = {
    success: false,
    error: null,
    content: null
  }
  // create
  users.save(data, function(err, result) {
    if (err === null) {
      res.success = true
      res.content = {
        '@rid': result['@rid']
      };
    } else {
      res.error = err;
    }
    response.end(JSON.stringify(res));
  });
}

exports.configure = function (app) {
  app.get('/user/_current', current);
  app.post('/user/register', register);

}