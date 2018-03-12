/* Gcoin Course - Controller functions for collection Membersip Orders */ 

var request = require('request');
var apiOptions = {
  server : "http://localhost:3300"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "http://gcoin.mybluemix.net:3300";
}

/* GET 'list membership orders' page */
var renderMemListOdrs = function(req, res, responseBody) {
  res.render('memListOdrs', {
    'title': 'Gcoin-Course - List Membership Orders',
    pageHeader: {
      title: 'Gcoin-Course',
      strapline: 'List Membership Orders'
    },
    memOdrs: responseBody
 });
};
module.exports.list_odrs = function(req, res) {
  var requestOptions, path;
  path = '/api/memOdrs';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body) {
      renderMemListOdrs(req, res, body);
    }
 );
};

/* GET 'process a membership order' page */
module.exports.proc_odr = function(req, res){
  res.render('memProcOdr', { 'title': 'Process a Membership Order' });
};

