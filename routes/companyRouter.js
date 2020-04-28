var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/companySingup', function (req, res, next) {
  res.render('Company/companySingup');
});

router.get('/companySingin', function (req, res, next) {
  res.render('Company/companySingin');
});

router.get('/companyDetail', function (req, res, next) {
  res.render('Company/companyDetail');
});

module.exports = router;
