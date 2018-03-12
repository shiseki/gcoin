const express = require('express');
const router = express.Router();
const ctrlGcoinReqs = require('../controllers/gcoinReqs');
const ctrlMemOdrs = require('../controllers/memOdrs');
const ctrlIdentities = require('../controllers/identities');

/* gcoin request APIs */
router.get('/gcoinReqs', ctrlGcoinReqs.gcoinReqsList);          // gcoinReqs?requester_id=<requester_id>
router.post('/gcoinReqs', ctrlGcoinReqs.gcoinReqsCreate);

/* membership order APIs */
router.get('/memOdrs', ctrlMemOdrs.memOdrsList);
router.post('/memOdrs', ctrlMemOdrs.memOdrsCreate);
router.get('/memOdrs/:memOdr_id', ctrlMemOdrs.memOdrsReadOne);
router.put('/memOdrs/:memOdr_idr', ctrlMemOdrs.memOdrsUpdateOne);

/* Identities */
router.get('/identities/:userID', ctrlIdentities.identitiesReadOne);

module.exports = router;
