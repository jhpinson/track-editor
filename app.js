/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  database = require('./libs/db');


var passport = require('passport');

require('./libs/auth').configurePassport(passport);


// orientdb
var orientdb = require("orientdb");
var dbConfig = {
  user_name: "admin",
  user_password: "admin"
};
var serverConfig = {
  host: "localhost",
  port: 2424
};
var server = new orientdb.Server(serverConfig);
var db = new orientdb.GraphDb("trackeditor", server, dbConfig);
db.open(function(err) {
  if (err) {
    throw err;
  }
  database.init(db, function(err) {
    if (err) {
      throw err;
    }
  });

});


var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use('/statics', express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);


require('./routes/track').configure(app);
require('./routes/auth').configure(app);
require('./routes/user').configure(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});