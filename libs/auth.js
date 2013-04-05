var users = require('./models/Users')

exports.configurePassport = function(passport) {
  var LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy({
    usernameField: 'email'
  },

  function(email, password, done) {

    users.get({
      'email': email,
      'password': password
    }, function(err, result) {
      if (err == null) {
        done(null, result);
      } else {
        done(null, false, {message : 'Le compte n\'existe pas ou le mot de passe est invalide'});
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user['@rid']);
  });

  passport.deserializeUser(function(id, done) {

    users.get({
      '@rid': id
    }, function(err, result) {
      done(null, result);
    });
  });
}