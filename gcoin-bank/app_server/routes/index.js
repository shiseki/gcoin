var express = require('express');
var router = express.Router();
var ctrlGcoinReqs = require('../controllers/gcoinReqs');
var ctrlOthers = require('../controllers/others');

/* GET home page. */
router.get('/gcoin/list_reqs', ctrlGcoinReqs.list_reqs);
router.get('/gcoin/proc_req', ctrlGcoinReqs.proc_req);      // /gcoin/proc_req?gcoinRequestId=<gcoinRequestId>
router.post('/gcoin/proc_req', ctrlGcoinReqs.doProc_req);

router.get('/', ctrlOthers.login);
router.get('/login', ctrlOthers.login);
router.post('/login', ctrlOthers.doLogin);
router.get('/logoff', ctrlOthers.logoff);
router.get('/about', ctrlOthers.about);

module.exports = router;
