const express = require('express');
const router = express.Router();
const ctrlMemOdrs = require('../controllers/memOdrs');
const ctrlIdentities = require('../controllers/identities');

/* membership order APIs */
router.get('/memOdrs', ctrlMemOdrs.memOdrsList);
router.get('/memOdrs/:memOdr_id', ctrlMemOdrs.memOdrsReadOne);
router.put('/memOdrs/:memOdr_idr', ctrlMemOdrs.memOdrsUpdateOne);

/* Identities */
router.get('/identities/:userID', ctrlIdentities.identitiesReadOne);

module.exports = router;
