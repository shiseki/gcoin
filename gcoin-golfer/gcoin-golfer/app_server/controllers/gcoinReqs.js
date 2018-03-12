const request = require('request');
let apiOptions = {
  server : "http://localhost:3200"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "http://gcoin.mybluemix.net:3200";
}

/* Check login function */
const _checkLogin = function(req, res) {
  if ((req.cookies.login == undefined) || (req.cookies.login != 'YES')) {
    res.redirect('/login');
  }
};

/* Get identities */
const _getIdentities = function(req, res, callback) {
  let requestOptions, path;
  path = '/api/identities/' + req.cookies.userID;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : true
  };
  request(
    requestOptions,
    function(err, response, identities) {
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
      } else {
        console.log('identities: ' + identities);
        callback(identities);
      }
    }
  );
}

/* GET 'about gcoin requests' page */
module.exports.about = function(req, res) {
  res.render('gcoinAbout', {'title': 'About Gcoin Requests'});
};

/* GET 'list gcoin requests' page */
const _renderGcoinListReqs = function(req, res, responseBody) {
  res.render('gcoinListReqs', {
    'title': 'Gcoin-Golfer - List My Gcoin Requests',
    pageHeader: {
      title: 'Gcoin-Golfer',
      strapline: 'List My Gcoin Requests'
    },
    gcoinReqs: responseBody
 });
};
module.exports.list_reqs = function(req, res) {
  _checkLogin(req, res);
  let requestOptions, path;
  path = '/api/gcoinReqs';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      _renderGcoinListReqs(req, res, body);
    }
 );
};

/* GET 'make a gcoin buy request' page */
module.exports.make_buyReq = function(req, res){
  _checkLogin(req, res);
  res.render('gcoinMakeBuyReq', {'title': 'Make a Gcoin Buy Request'});
};

/* POST from 'make a gcoin buy request' page */
module.exports.doMake_buyReq = function(req, res){
/* get enrollment ID and secret */
  _getIdentities(req, res, function(identities) {
/* call POST /api/gcoinReqs API to make a gcoin buy request on the blockchain */
    let requestOptions, path, postdata;
    path = '/api/gcoinReqs';
    postdata = {
      enrollmentId: identities.enrollmentId,
      enrollmentSecret: identities.enrollmentSecret,
      requester: identities.participantId,
      bank: req.body.bank,
      requestType: 'BUY',
      amount: parseInt(req.body.amount)
    }
    requestOptions = {
      url : apiOptions.server + path,
      method : "POST",
      json : postdata
    };
    request(
      requestOptions,
      function(err, response, body) {
        res.redirect('/gcoin/list_reqs');
      }
    );
  });
};

/* GET 'make a gcoin sell request' page */
module.exports.make_sellReq = function(req, res){
  _checkLogin(req, res);
  res.render('gcoinMakeSellReq', {'title': 'Make a Gcoin Sell Request'});
};

/* POST from 'make a gcoin sell request' page */
module.exports.doMake_sellReq = function(req, res){
/* get enrollment ID and secret */
  let identities = _getIdentities(req, res);

/* call POST /api/gcoinReqs API to make a gcoin sell request on the blockchain */
  let requestOptions, path, postdata;
  path = '/api/gcoinReqs';
  postdata = {
    enrollmentId: identities.enrollmentId,
    enrollmentSecret: identities.enrollmentSecret,
    requester: identities.participantId,
    bank: req.body.bank,
    requestType: 'SELL',
    amount: parseInt(req.body.amount)
  }
  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  request(
    requestOptions,
    function(err, response, body) {
      res.redirect('/gcoin/list_reqs');
    }
  );
};
