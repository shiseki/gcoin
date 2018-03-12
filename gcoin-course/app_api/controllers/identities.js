/* Identity Request APIs for golf courses to get password, enrollment ID, enrollment secret, and participant ID */

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

/* Read a set of identities by userID */
module.exports.identitiesReadOne = function(req, res) {
  const CourseID = global.gcoinDB.model('CourseID');
  if (req.params && req.params.userID) {
    CourseID.findOne({userID: req.params.userID}).exec(function(err, identity) {
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