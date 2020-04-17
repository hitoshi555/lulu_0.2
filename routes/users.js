var express = require('express');
var router = express.Router();
const User = require('../model/userSchema');


/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await User.find({});
  res.render('user', {data:users});
});


module.exports = router;
