var request = require('request');
var apiOptions = {
  server : "http://localhost:3300"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://gcoin.mybluemix.net";
}
/* GET 'membership order list' page */
var renderMemOdrList = function(req, res, responseBody){
  res.render('memOdrList', {
    title : 'Gcoin-Gofer - List Membership Orders',
    pageHeader: {
      title: 'Gcoin-Golfer',
      strapline: 'List Membership Orders'
    },
    memOdrs: responseBody
  });
};
module.exports.odrlist = function(req, res){
  var requestOptions, path;
  path = '/api/mem';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      renderMemOdrList(req, res, body);
    }
  );
};

/* old */

///* GET 'membership order list' page */
//module.exports.odrlist = function(req, res){
//  res.render('index', { 'title': 'List Membership Orders' });
//};

/* GET 'buy order' page */
module.exports.buyodr = function(req, res){
  res.render('index', { 'title': 'Submit a Buy Membership Order' });
};

/* GET 'sell order' page */
module.exports.sellodr = function(req, res){
  res.render('index', { 'title': 'Submit a Sell My Membership Order' });
};
