var request = require('request');
var apiOptions = {
  server : "http://localhost:3100"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "http://gcoin.mybluemix.net:3100";
}

/* Check login function */
var _checkLogin = function(req, res) {
  if ((req.cookies.login == undefined) || (req.cookies.login != 'YES')) {
    res.redirect('/login');
  }
};

/* GET 'list gcoin requests' page */
var _renderGcoinListReqs = function(req, res, gcoinReqs) {
  res.render('gcoinListReqs', {
    'title': 'List Gcoin Requests to My Bank',
    'pageHeader': {
      'title': 'Gcoin-Bank',
      'strapline': 'List Gcoin Requests to My Bank'
    },
    'gcoinReqs': gcoinReqs
 });
};
module.exports.list_reqs = function(req, res) {
  _checkLogin(req, res);
  var requestOptions, path;
  path = '/api/gcoinReqs?bank_id=gcoin@abcbank.com';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : true
  };
  request(
    requestOptions,
    function(err, response, gcoinReqs) {
      _renderGcoinListReqs(req, res, gcoinReqs);
    }
  );
};

/* GET 'process a gcoin request' page */
module.exports.proc_req = function(req, res){
  var gcoinRequestId = req.query.gcoinRequestId;
  _checkLogin(req, res);
  res.render('gcoinProcReq', {
    'title': 'Process a Gcoin Request',
    'id': gcoinRequestId,
    'requester': 'isao.aoki@gmail.com',
    'bank': 'gcoin@abcbank.com',
    'sellOrBuy': 'Buy',
    'gcoinAmount': 1000000,
    'requestedDate': '0605,2017' 
  });
};

/* POST from 'process a gcoin request' page */
module.exports.doProc_req = function(req, res) {
  res.redirect('/gcoin/list_reqs');
};

