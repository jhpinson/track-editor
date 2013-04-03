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

});

var record = null;

var test = function () {
  var post = {
        title: 'Test',
        text: 'text',
        creation_date: new Date()
    };
    db.createVertex(post, { "class": "Track" }, function(err, result) {
        record = result;
    });
}