var express = require('express');
var router = express.Router();
var ctrlGcoinReqs = require('../controllers/gcoinReqs');
var ctrlMemOdrs = require('../controllers/memOdrs');
var ctrlOthers = require('../controllers/others');

/* GET gcoin request pages */
router.get('/gcoin/about', ctrlGcoinReqs.about);
router.get('/gcoin/make_buyReq', ctrlGcoinReqs.make_buyReq);
router.post('/gcoin/make_buyReq', ctrlGcoinReqs.doMake_buyReq);
router.get('/gcoin/make_sellReq', ctrlGcoinReqs.make_sellReq);
router.post('/gcoin/make_sellReq', ctrlGcoinReqs.doMake_sellReq);
router.get('/gcoin/list_reqs', ctrlGcoinReqs.list_reqs);

/* GET membership order pages */
router.get('/mem/about', ctrlMemOdrs.about);
router.get('/mem/place_sellOdr', ctrlMemOdrs.place_sellOdr);
router.post('/mem/place_sellOdr', ctrlMemOdrs.doPlace_sellOdr);
router.get('/mem/place_buyOdr', ctrlMemOdrs.place_buyOdr);
router.post('/mem/place_buyOdr', ctrlMemOdrs.doPlace_buyOdr);
router.get('/mem/list_odrs', ctrlMemOdrs.list_odrs);

/* GET other pages */
router.get('/', ctrlOthers.login);
router.get('/login', ctrlOthers.login);
router.post('/login', ctrlOthers.doLogin);
router.get('/logoff', ctrlOthers.logoff);
router.get('/about', ctrlOthers.about);

module.exports = router;
