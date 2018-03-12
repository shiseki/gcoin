/* Membership order API for Golfers to sell and buy membership */

/* Read Membership Orders to make a list of all membership buy and sell orders in the market */ 
module.exports.memOdrsList = function(req, res) {          // memOdrs?requester_id=<requester_id> for marking my orders 
  res.status(200);
  res.json({"status" : "success"});
};

/* Read a Membership Order by membership order id */
module.exports.memOdrsReadOne = function(req, res) {
  res.status(200);
  res.json({"status" : "success"});
};

/* Update a Membership Order by membership order id to complete membership transfer */
module.exports.memOdrsUpdateOne = function(req, res) {
  res.status(200);
  res.json({"status" : "success"});
};

