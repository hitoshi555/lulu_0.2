var express = require('express');
var router = express.Router();
const flash = require('express-flash');
var app = express();
const User = require('../model/userSchema');

var passport = require('passport');

const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await User.find({});
  res.render('user', {data:users});
});

router.get('/userSingup', function(req, res, next) {
  res.render('userSingup');
});

router.post('/userSingup',async function(req, res, next){
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.body.repassword);
  var password = req.body.password;
  var repassword = req.body.repassword;
  let has_password = bcrypt.hashSync(password, 10);
  console.log(has_password);

  //if pw 6文字以下
  //pw と　repwがあっていない
  if( password !== repassword){
    req.flash('err', 'パスワードが一致していません');
    return res.render('userSingup')
  }

  if( password.length <= 5){
    req.flash('err', 'パスワードが6文字以上ではありません');
    return res.render('userSingup')
  }

  if(User.findOne({email: req.body.email})){
    const user = new User({
      email: req.body.email,
      password: has_password
    });
    const savedUser = await user.save();
    var project = await Project.find({});
    return res.render('index',{data:savedUser, project : project });
  }else{
    req.flash('err', 'すでにこのメールアドレスは使われております');
    return res.render('userSingup')
  }
});

router.get('/userSingin', function(req, res, next) {
  res.render('userSingin');
});

router.post('/userSingin',
    passport.authenticate(
      'login',
      {
        successRedirect: '/',
        failureRedirect: '/users/userSingin',
        session: true
      }
    )
  );

router.get('/userlogout',(req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/userDetail', function(req, res, next){
  res.render('userDetail');
});


module.exports = router;