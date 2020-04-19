var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/companySingup', function(req, res, next) {
  res.render('companySingup');
});

router.get('/companySingin', function(req, res, next) {
  res.render('companySingin');
});

router.get('/companyDetail', function(req, res, next) {
  res.render('companyDetail');
});

module.exports = router;
