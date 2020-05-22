var express = require('express');
var router = express.Router();
const User = require('../model/userSchema');
const UserDetail =require('../model/userDetailSchema');
const Project = require('../model/projectSchema');
const Applicate =  require('../model/applicateSchema');

var passport = require('passport');

const bcrypt = require('bcrypt');

//認証機能
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    // 認証済
    return next();
  } else {
    // 認証されていない
    res.redirect('/users/userSingin'); // ログイン画面に遷移
  }
}

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


      var user;
      if (req.user == null){
        user = ""
      }else{
        user = req.user['type']
      }


      var company = await User.find({type:"company"});
      var companyDetail = [];
      for (var i in company){
        var detail = await UserDetail.findOne({u_email:company[i].email})
        if(detail !=null){
          companyDetail.push(detail);
          console.log(detail.name)
        }else{
          detail = await User.findOne({email:company[i].email})
          companyDetail.push(detail);
          console.log(detail.email)
        }
      }
  console.log(companyDetail);
      return res.render('index',{data:savedUser, projects : projects ,user:user, companyDetail:companyDetail});
  });
});

router.get('/companySingin', function (req, res, next) {
  res.render('Company/companySingin');
});

router.post(
  '/companySingin',
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/company/companySingin',
    session: true,
  })
);

router.post('/companyFollow', isAuthenticated , async function (req, res, next) {
  //フォロー押される
  //cuserDetail取得
  //フォロしてたらそのまま戻す
  //companyのfollowにreq.user['email']を入れる
  //indexに戻す
  const company = await UserDetail.findOneAndUpdate(
    { u_email: req.body.email },
    { $push:
      {
        follow : req.user['email']
      }
    }
  )
  
  return res.redirect('/');

});


router.get('/companyDetail', isAuthenticated ,async function (req, res, next) {
  var user = await User.findOne({email: req.user['email']});
  var userDetail =await UserDetail.findOne({u_email:req.user['email']},async (err, detail)=>{
    if(!detail){
      const createDetail = new UserDetail({
        u_email:req.user['email'],
        name:"",
        detail:""
      });
      console.log(createDetail);
      await createDetail.save();
    }
  });
  var applicate = await Applicate.find({email:req.user['email']})
  var box = [];
  for(var e in applicate){
    a = await Project.findById(applicate[e].p_id);
    box.push(a);
  }
  
  const data= await Project.find({userId:req.user['email']})
  res.render(
    'Company/companyDetail',
    {
      userDetail : userDetail,
      user:user.id,
      projects: box,
      orderProject: data,
    });
});


router.get('/companyDetail/:email',async function (req, res, next) {
  User.findOne({email:req.params.email},async (err, user)=>{
    if (err) console.log('error');

    var userDetail =await UserDetail.findOne({u_email:req.params.email},async (err, detail)=>{
      if(!detail){
        const createDetail = new UserDetail({
          u_email:req.params.email,
          name:"",
          detail:""
        });
        console.log(createDetail);
        await createDetail.save();
      }
    });
    var applicate = await Applicate.find({email:req.params.email})
var box = [];
for(var e in applicate){
  a = await Project.findById(applicate[e].p_id);
  box.push(a);
}

const data= await Project.find({userId:req.params.email})
res.render(
  'Company/companyDetail',
  {
    userDetail : userDetail,
    user:user._id,
    projects: box,
    orderProject: data,
  });
  });
});










router.get('/companyDetail/edit/:id', isAuthenticated ,async function (req, res, next) {
  console.log("aaaaa");
  User.findById(req.params.id, (err, user) => {
    if (err) console.log('error');
    UserDetail.findOne({u_email: user.email}, (err, userDetail) => {
      if (err) console.log('error');
      console.log(userDetail);
      res.render('Company/companyEdit',{userDetail : userDetail,user:user._id,email:user.email});
    });
  });
});

router.post('/companyDetail/update/:id', async (req, res) => {
  console.log("aaaaa");
  console.log(req.body);
  const userDetail = await UserDetail.update(
    { u_email: req.body.u_email },
    {
      $set: {
        name:req.body.name,
        detail:req.body.detail
      },
    },
    function (err) {
      if (err) {
        res.send(err);
        console.log(err);
      }
    }
  );
  res.redirect('/company/companyDetail');
});

module.exports = router;
