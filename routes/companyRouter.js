var express = require('express');
var router = express.Router();
const User = require('../model/userSchema');
const UserDetail =require('../model/userDetailSchema');
const Project = require('../model/projectSchema');
const Applicate =  require('../model/applicateSchema');

var passport = require('passport');

const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/companySingup', function (req, res, next) {
  res.render('Company/companySingup');
});

router.post('/companySingup', function (req, res, next) {
  console.log(req.body.email);
  console.log(req.body.password);
  console.log(req.body.repassword);
  console.log(req.body.type);
  var password = req.body.password;
  let has_password = bcrypt.hashSync(password, 10);
  console.log(has_password);
  var repassword = req.body.repassword;
  
  if( password !== repassword){
    req.flash('err', 'パスワードが一致していません');
    return res.render('User/userSingup')
  }

  if( password.length <= 5){
    req.flash('err', 'パスワードが6文字以上ではありません');
    return res.render('User/userSingup')
  }

  User.findOne({email: req.body.email}, async (err,user) => {
      if(user){
        req.flash('err', 'すでにこのメールアドレスは使われております');
        return res.render('User/userSingup')
      }
      const saveuser = new User({
        email: req.body.email,
        password: has_password,
        type: req.body.type
      });
      const savedUser = await saveuser.save();
      var projects = await Project.find({});
      return res.render('index',{data:savedUser, projects : projects });
  });
});

router.get('/companySingin', function (req, res, next) {
  res.render('Company/companySingin');
});

router.post(
  '/companySingin',

);

router.post(
  '/companySingin',
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/company/companySingin',
    session: true,
  })
);

router.get('/companyDetail', function (req, res, next) {
  res.render('Company/companyDetail');
});

module.exports = router;
