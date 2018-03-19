const request = require('request');
const apiOptions = {
  server : "http://localhost:3300"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "http://gcoin.mybluemix.net:3300";
}

/* GET 'login' page */
module.exports.login = function(req, res){
  if ((req.cookies.course_login != undefined) && (req.cookies.course_login == 'YES')) {
    console.log('already logged in');
    res.redirect('/about');
  } else {
    res.render('login', { 'title': 'Login Gcoin for Golf Courses' });
  }
};

/* POST from 'login' page */
module.exports.doLogin = function(req, res){
  if (req.body.id != '') {
    let requestOptions, path;
    path = '/api/identities/' + req.body.id;
    requestOptions = {
      url : apiOptions.server + path,
      method : "GET",
      json : true
    };
    request(
      requestOptions,
      function(err, response, identity) {
        if (err) {
          res.status(err.status || 500);
          res.render('error', {
            message: err.message,
            error: err
          });
        } else if (response.statusCode != 200) {
          console.log('GET identity response code: ' + response.statusCode);
          console.log('userID not found');
          res.redirect('/login');
        } else if ((req.body.pw != '') && (req.body.pw == identity.password)) {
          res.cookie('course_login', 'YES');
          res.cookie('course_userID', req.body.id);
          res.redirect('/about');
        } else {
          console.log('password is incorrect');
          res.redirect('/login');
        }
      }
    );
  } else {
    res.redirect('/login');
  }
};

/* GET 'about' page */
module.exports.about = function(req, res){
  res.render('generic-text', { 'title': 'About Gcoin for Golf Courses' });
};

/* GET 'logoff' page */
module.exports.logoff = function(req, res){
  if (req.cookies.login != undefined) {
    res.clearCookie('course_login');
    res.clearCookie('course_userID');
  }
  res.render('logoff', { 'title': 'Logoff Gcoin for Golf Courses' });
};

