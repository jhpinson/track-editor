var passport = require('passport');

var login = function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.send({
        'status': 'err',
        'message': err.message
      });
    }
    if (!user) {
      return res.send({
        'status': 'fail',
        'message': info.message
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.send({
          'status': 'err',
          'message': err.message
        });
      }
      return res.send({
        'status': 'ok',
        'user' : req.user
      });
    });
  })(req, res, next);
}

var logout = function (req, res) {
  res.end('tofo');
}

exports.configure = function (app) {
  app.post('/login', login);
  app.get('/logout', logout);
}
