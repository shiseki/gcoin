/* Gcoin Request APIs for banks to list and process gcoin requests */

/* Read Gcoin Requests to make a list of gcoin requests to my bank */
module.exports.gcoinReqsList = function(req, res) {          // gcoinReqs?bank_id=<bank_id>
  var gcoinReqs = [{
    'id' : '12301',
    'requester' : 'isao.aoki@gmail.com',
    'bank' : 'gcoin@abcbank.com',
    'sellOrBuy' : 'Buy',
    'gcoinAmount' : 1000000,
    'requestedDate' : '06/05, 2017',
    'processedDate' : '06/05, 2017'
  },{
    'id' : '12355',
    'requester' : 'kotone.hori@gmail.com',
    'bank' : 'gcoin@abcbank.com',
    'sellOrBuy' : 'Buy',
    'gcoinAmount' : 1000,
    'requestedDate' : '06/07, 2017',
    'processedDate' : ''
  }];
  res.status(200);
  res.json(gcoinReqs);
};

/* Read a Gcoin Request by gcoin request id */
module.exports.gcoinReqsReadOne = function(req, res) {
  res.status(200);
  res.json({"status" : "success"});
};

/* Update a Gcoin Request by gcoin request id to process a gcoin request */
module.exports.gcoinReqsUpdateOne = function(req, res) {
  res.status(200);
  res.json({"status" : "success"});
};

