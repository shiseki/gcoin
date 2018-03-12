const express = require('express');
const router = express.Router();
const ctrlGcoinReqs = require('../controllers/gcoinReqs');
const ctrlIdentities = require('../controllers/identities');

/* Gcoin */
router.get('/gcoinReqs', ctrlGcoinReqs.gcoinReqsList);            // gcoinReqs?userName=<userName>
router.get('/gcoinReqs/:gcoinRequestId', ctrlGcoinReqs.gcoinReqsReadOne);    // gcoinReqs/:gcoinRequestId?userName=<userName>
router.put('/gcoinReqs/:gcoinRequestId', ctrlGcoinReqs.gcoinReqsUpdateOne);  // gcoinReqs/:gcoinRequestId?userName=<userName>

/* Identities */
router.get('/identities/:userID', ctrlIdentities.identitiesReadOne);

module.exports = router;
