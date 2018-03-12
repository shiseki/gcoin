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
let userID1, userID2, identities1, identities2;
const _getIdentities = function(req, res, userID, callback) {
  let requestOptions, path;
  path = '/api/identities/' + userID;       // login ID or User ID in the gcoin request form
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
};

/* GET 'about gcoin requests' page */
module.exports.about = function(req, res) {
  res.render('gcoinAbout', {'title': 'About Gcoin Requests'});
};

/* GET 'list gcoin requests' page */
const _renderGcoinListReqs = function(req, res, gcoinReqs) {
  res.render('gcoinListReqs', {
    'title': 'Gcoin-Golfer - List My Gcoin Requests',
    pageHeader: {
      title: 'Gcoin-Golfer',
      strapline: 'List My Gcoin Requests'
    },
    gcoinReqs: gcoinReqs
  });
};

module.exports.list_reqs = function(req, res) {
  _checkLogin(req, res);
  let requestOptions, path;
  path = '/api/gcoinReqs?userName=' + req.cookies.userName;
  console.log("path: " + path);
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, gcoinReqs) {
      _renderGcoinListReqs(req, res, gcoinReqs);
    }
  );
};

/* GET 'make a gcoin buy request' page */
module.exports.make_buyReq = function(req, res) {
  _checkLogin(req, res);
  res.render('gcoinMakeBuyReq', {'title': 'Make a Gcoin Buy Request'});
};

/* POST from 'make a gcoin buy request' page */
module.exports.doMake_buyReq = function(req, res) {
/* get user name and participant ID from application user ID */
  userID1 = req.cookies.userID;    // application user ID used with login
  userID2 = req.body.id;           // user ID specified in the gcoin buy request form
  _getIdentities(req, res, userID1, function(identities) {
    identities1 = identities;
    _getIdentities(req, res, userID2, function(identities) {
      identities2 = identities;
/* call POST /api/gcoinReqs API to make a gcoin buy request on the blockchain */
      let requestOptions, path, postdata;
      path = '/api/gcoinReqs/' + '?userName=' + identities1.userName;
      postdata = {
        "userName": identities1.userName,
        "requester": identities2.participantId,
        "bank": req.body.bank,
        "requestType": 'BUY',
        "amount": parseInt(req.body.amount)
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
  });
};

/* GET 'make a gcoin sell request' page */
module.exports.make_sellReq = function(req, res) {
  _checkLogin(req, res);
  res.render('gcoinMakeSellReq', {'title': 'Make a Gcoin Sell Request'});
};

/* POST from 'make a gcoin sell request' page */
module.exports.doMake_sellReq = function(req, res) {
/* get user name and participant ID from application user ID */
  userID1 = req.cookies.userID;    // application user ID used with login
  userID2 = req.body.id;           // user ID specified in the gcoin sell request form
  _getIdentities(req, res, userID1, function(identities) {
    identities1 = identities;
    _getIdentities(req, res, userID2, function(identities) {
      identities2 = identities;
/* call POST /api/gcoinReqs API to make a gcoin sell request on the blockchain */
      let requestOptions, path, postdata;
      path = '/api/gcoinReqs/' + '?userName=' + identities1.userName;
      postdata = {
        "userName": identities1.userName,
        "requester": identities2.participantId,
        "bank": req.body.bank,
        "requestType": 'SELL',
        "amount": parseInt(req.body.amount)
      };
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
  });
};

