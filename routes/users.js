var express = require('express');
var router = express.Router();
var app = express();
const User = require('../model/userSchema');

var passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
app.use(passport.initialize());
  passport.use("login",
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },async (username, password, done) => {
      console.log(username);
      try{
        console.log("aaaaaa");
          await User.findOne({email: username}, (err, user) => {
            console.log("aaaaaa2");
              if(err){
                console.log("aaaaaa3");
                  return done(err);
              }
              if(!user){
                console.log(user);
                  return done(null, false);
              }
              if(user.toObject().password != password){
                console.log("aaaaaa5");
                  return done(null, false);
              }
              console.log("aaaaaa6");
              return done(null, user);
          })
      } catch(err) {
          console.log(err);
      }
  }
)
  );
  
  

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
  //if で判定
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });
  const savedUser = await user.save();
  res.render('index',{data:savedUser});
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
        session: false
      }
    )
  );

router.get('/userlogout',(req, res) => {
  req.logout();
  console.log("done");
  res.redirect("/");
});

router.get('/userDetail', function(req, res, next){
  res.render('userDetail');
});


module.exports = router;