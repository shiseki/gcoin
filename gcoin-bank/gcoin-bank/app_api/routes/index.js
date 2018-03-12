const express = require('express');
const router = express.Router();
const ctrlGcoinReqs = require('../controllers/gcoinReqs');
const ctrlIdentities = require('../controllers/identities');

/* Gcoin */
router.get('/gcoinReqs', ctrlGcoinReqs.gcoinReqsList);            // gcoinReqsList?bank_id=<bank_id> 
router.get('/gcoinReqs/:gcoinReq_id', ctrlGcoinReqs.gcoinReqsReadOne);
router.put('/gcoinReqs/:gcoinReq_id', ctrlGcoinReqs.gcoinReqsUpdateOne);

/* Identities */
router.get('/identities/:userID', ctrlIdentities.identitiesReadOne);

module.exports = router;
