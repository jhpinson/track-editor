var users = require('../libs/models/users');





var save = function(req, response) {

  if (typeof(req.user) == 'undefined')  {
    response.statusCode = 401;
    response.end();
    return;
  }

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
    response.send(res);
  })
}



exports.configure = function(app) {
  //app.get('/user/_current', current);
  //app.post('/user/register', register);

}