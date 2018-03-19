var request = require('request');
var apiOptions = {
  server : "http://localhost:3200"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "http://gcoin.mybluemix.net:3200";
}

/* Check login function */
var _checkLogin = function(req, res) {
  if ((req.cookies.golfer_login == undefined) || (req.cookies.golfer_login != 'YES')) {
    res.redirect('/login');
  }
};

/* GET 'about membership orders' page */
module.exports.about = function(req, res) {
  res.render('memAbout', {'title': 'About Membership Orders'});
};

/* GET 'list membership orders' page */
var _renderMemListOdrs = function(req, res, responseBody) {
  res.render('memListOdrs', {
    'title': 'Gcoin-Golfer - List Membership Orders',
    pageHeader: {
      title: 'Gcoin-Golfer',
      strapline: 'List Membership Orders'
    },
    memOdrs: responseBody
 });
};
module.exports.list_odrs = function(req, res) {
  _checkLogin(req, res);
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
      _renderMemListOdrs(req, res, body);
    }
 );
};

/* GET 'place a sell order' page */
module.exports.place_sellOdr = function(req, res) {
  _checkLogin(req, res);
  res.render('memPlaceSellOdr', {'title': 'Place a Membership Sell Order'});
};

/* POST from 'place a sell order' page */
module.exports.doPlace_sellOdr = function(req, res) {
  res.redirect('/mem/list_odrs');
};

/* GET 'place a buy order' page */
module.exports.place_buyOdr = function(req, res) {
  _checkLogin(req, res);
  res.render('memPlaceBuyOdr', {'title': 'Place a Membership Buy Order'});
};

/* POST from 'place a buy order' page */
module.exports.doPlace_buyOdr = function(req, res) {
  res.redirect('/mem/list_odrs');
};

