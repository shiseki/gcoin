const request = require('request');
const apiOptions = {
  server : "http://localhost:3200"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "http://gcoin.mybluemix.net:3200";
}

/* GET 'login' page */
module.exports.login = function(req, res){
  if ((req.cookies.golfer_login != undefined) && (req.cookies.golfer_login == 'YES')) {
    console.log('already logged in');
    res.redirect('/about');
  } else {
    res.render('login', { 'title': 'Login Gcoin for Golfers' });
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
          console.log('GET identities response code: ' + response.statusCode);
          console.log('userID not found');
          res.redirect('/login');
        } else if ((req.body.pw != '') && (req.body.pw == identity.password)) {
          console.log("identity.password: " + identity.password);
          res.cookie('golfer_login', 'YES');
          res.cookie('golfer_userID', req.body.id);
          console.log("identity.userName: " + identity.userName);
          res.cookie('golfer_userName', identity.userName);      // userName is used to get cardName from config
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
  res.render('generic-text', { 'title': 'About Gcoin for Golfers' });
};

/* GET 'logoff' page */
module.exports.logoff = function(req, res){
  if (req.cookies.golfer_login != undefined) {
    res.clearCookie('golfer_login');
    res.clearCookie('golfer_userID');
  }
  res.render('logoff', { 'title': 'Logoff Gcoin for Golfers' });
};

