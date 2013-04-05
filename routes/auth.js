var passport = require('passport');
var users = require('../libs/models/users');

var register = function(req, response) {
  var data = req.body;
  var res = {
    success: false,
    error: null,
    content: null
  }
  users.get({
    email: data.email
  }, function(err, result) {
    if (err === null) {
      res.error = 'Un compte avec cette adresse email existe déja';
      response.send(res);
    } else {
      // create
      users.save(data, function(err, result) {
        if (err === null) {
          req.logIn(result, function(err) {
            if (err) {
              res.error = 'Something went wrong';
              return response.send(res);
            }
            res.success = true
            res.content = result;
            return response.send(res);
          });

        } else {
          res.error = 'Une erreur s\'est produite, veuillez réessayer plus tard.';
          response.send(res);
        }

      });
    }
  })

}

var current = function(req, res) {

  if (typeof(req.user) !== 'undefined') {
    data = req.user;
    res.send(data);
  } else {
    res.statusCode = 401;
    res.end()
  }

};

var login = function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.send({
        'success' : false,
        'error' : 'Something went wrong',
      });
    }
    if (user === false) {
      return res.send({
        'success' : false,
        'error' : info.message
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.send({
          'success' : false,
          'error' : 'Something went wrong',
        });
      }
      return res.send({
        'success' : true,
        'error' : null,
        'user' : req.user
      });
    });
  })(req, res, next);
}

var logout = function (req, res) {
  req.logout();
  return res.send({
        'success': 'true'
      });
}

exports.configure = function (app) {
  app.post('/auth/login', login);
  app.get('/auth/logout', logout);
  app.post('/auth/register', register);
  app.get('/auth/current', current);
}
