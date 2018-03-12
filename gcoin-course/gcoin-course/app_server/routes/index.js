var express = require('express');
var router = express.Router();
var ctrlMemOdrs = require('../controllers/memOdrs');
var ctrlOthers = require('../controllers/others');

/* GET membership order pages */
router.get('/mem', ctrlMemOdrs.list_odrs);
router.get('/mem/buyodr', ctrlMemOdrs.proc_odr);

/* GET other pages */
router.get('/', ctrlOthers.login);
router.get('/logoff', ctrlOthers.logoff);
router.get('/about', ctrlOthers.about);

module.exports = router;
