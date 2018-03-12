/* Identity Request APIs for banks to get password, enrollment ID, enrollment secret, and participant ID */

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

/* Read a set of identities by userID */
module.exports.identitiesReadOne = function(req, res) {
  const BankID = global.gcoinDB.model('BankID');
  if (req.params && req.params.userID) {
    BankID.findOne({userID: req.params.userID}).exec(function(err, identity) {
      if (!identity) {
        res.status(404);
        res.json({"message": "identity not found"});
        return;
      }
      if (err) {
        res.status(404);
        res.json(err);
        return;
      }
      res.status(200);
      res.json(identity);
    });
  } else {
   res.status(404);
   res.json({"message": "No userID in request"});
  }
};