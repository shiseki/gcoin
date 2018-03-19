const request = require('request');
let apiOptions = {
  server : "http://localhost:3100"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "http://gcoin.mybluemix.net:3100";
}

/* Check login function */
const _checkLogin = function(req, res) {
  if ((req.cookies.bank_login == undefined) || (req.cookies.bank_login != 'YES')) {
    res.redirect('/login');
  }
};

/* GET 'list gcoin requests' page */
const _renderGcoinListReqs = function(req, res, gcoinReqs) {
  res.render('gcoinListReqs', {
    'title': 'List Gcoin Requests to My Bank',
    'pageHeader': {
      'title': 'Gcoin-Bank',
      'strapline': 'List Gcoin Requests to My Bank'
    },
    'gcoinReqs': gcoinReqs
 });
};

/* GET 'process gcoin request' page */
const _renderGcoinProcReq = function(req, res, gcoinReq) {
  res.render('gcoinProcReq', {
    'title': 'Process a Gcoin Request to My Bank',
    'pageHeader': {
      'title': 'Gcoin-Bank',
      'strapline': 'Process a Gcoin Requests to My Bank'
    },
    'gcoinReq': gcoinReq
 });
};

module.exports.list_reqs = function(req, res) {
  _checkLogin(req, res);
  let requestOptions, path;
  path = '/api/gcoinReqs?userName=' + req.cookies.bank_userName;
  console.log("path: " + path);
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
  _checkLogin(req, res);
  let requestOptions, path;
  path = '/api/gcoinReqs/' + req.query.gcoinRequestId + '?userName=' + req.cookies.bank_userName;
  console.log("path: " + path);
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : true
  };
  request(
    requestOptions,
    function(err, response, gcoinReq) {
      console.log('gcoinRequestId: ' + gcoinReq.gcoinRequestId);
      console.log('requester: ' + gcoinReq.requester);
      console.log('bank: ' + gcoinReq.bank);
      console.log('requestType: ' + gcoinReq.requestType);
      console.log('amount: ' + gcoinReq.amount);
      console.log('requestDate: ' + gcoinReq.requestDate);
      console.log('processDate: ' + gcoinReq.processDate);
      _renderGcoinProcReq(req, res, gcoinReq);
    }
  );
};

/* POST from 'process a gcoin request' page */
module.exports.doProc_req = function(req, res) {
  _checkLogin(req, res);
  let requestOptions, path;
  path = '/api/gcoinReqs/' + req.query.gcoinRequestId + '?userName=' + req.cookies.bank_userName;
  console.log("path: " + path);
  requestOptions = {
    url : apiOptions.server + path,
    method : "PUT",
    json : true
  };
  request(
    requestOptions,
    function(err, response, gcoinReq) {
      console.log('gcoinRequestId: ' + gcoinReq.gcoinRequestId);
      console.log('requester: ' + gcoinReq.requester);
      console.log('bank: ' + gcoinReq.bank);
      console.log('requestType: ' + gcoinReq.requestType);
      console.log('amount: ' + gcoinReq.amount);
      console.log('requestDate: ' + gcoinReq.requestDate);
      console.log('processDate: ' + gcoinReq.processDate);
      res.redirect('/gcoin/list_reqs');
    }
  );
};

