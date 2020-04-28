var express = require('express');
var router = express.Router();
var app = express();
const User = require('../model/userSchema');

var passport = require('passport');

const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const users = await User.find({});
  res.render('Use/user', { data: users });
});

router.get('/userSingup', function (req, res, next) {
  res.render('Use/userSingup');
});

router.post('/userSingup', async function (req, res, next) {
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.body.repassword);
  var password = req.body.password;
  let has_password = bcrypt.hashSync(password, 10);
  console.log(has_password);

  //if で判定
  const user = new User({
    email: req.body.email,
    password: has_password,
  });
  const savedUser = await user.save();
  res.render('index', { data: savedUser });
});

router.get('/userSingin', function (req, res, next) {
  res.render('Use/userSingin');
});

router.post(
  '/userSingin',
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/users/userSingin',
    session: true,
  })
);

router.get('/userlogout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/userDetail', function (req, res, next) {
  res.render('Use/userDetail');
});

module.exports = router;
