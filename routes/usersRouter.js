var express = require('express');
var router = express.Router();
var app = express();
const User = require('../model/userSchema');
const UserDetail = require('../model/userDetailSchema');
const Project = require('../model/projectSchema');
const Applicate = require('../model/applicateSchema');

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

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const users = await User.find({});
  res.render('User/user', { data: users });
});

router.get('/userSingup', function (req, res, next) {
  res.render('User/userSingup');
});

router.post('/userSingup', async function (req, res, next) {
  var password = req.body.password;
  let has_password = bcrypt.hashSync(password, 10);
  var repassword = req.body.repassword;

  if (password !== repassword) {
    req.flash('err', 'パスワードが一致していません');
    return res.render('User/userSingup');
  }

  if (password.length <= 5) {
    req.flash('err', 'パスワードが6文字以上ではありません');
    return res.render('User/userSingup');
  }

  User.findOne({ email: req.body.email }, async (err, user) => {
    if (user) {
      req.flash('err', 'すでにこのメールアドレスは使われております');
      return res.render('User/userSingup');
    }
    const saveuser = new User({
      email: req.body.email,
      password: has_password,
      type: req.body.type,
    });
    const savedUser = await saveuser.save();
    var projects = await Project.find({});
    return res.redirect('/');
  });
});

router.get('/userSingin', function (req, res, next) {
  res.render('User/userSingin');
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

router.get('/userDetail', isAuthenticated, async function (req, res, next) {
  var user = await User.findOne({ email: req.user['email'] });
  var userDetail = await UserDetail.findOne(
    { u_email: req.user['email'] },
    async (err, detail) => {
      if (!detail) {
        const createDetail = new UserDetail({
          u_email: req.user['email'],
          name: '',
          detail: '',
          follow: [],
        });
        await createDetail.save();
      }
    }
  );
  //応募

  var applicate = await Applicate.find({
    email: req.user['email'],
    flag: false,
  });

  var box = [];
  for (var e in applicate) {
    var a = await Project.find(applicate[e].p_id);
    box.push(a);
  }

  //完了
  var finish = await Project.find({
    userId: req.user['email'],
    finishFlag: true,
  });

  //発注
  var noOrder = await Applicate.find({ flag: false });
  var orderData = await Project.find({
    userId: req.user['email'],
    finishFlag: false,
  });

  //進行

  //発注進行
  var progress = await Applicate.find({ flag: true });
  var pr = await Project.find({
    finishFlag: false,
    userId: req.user['email'],
  });

  var box21 = progress.map((p) => {
    return pr.find((d) => {
      return d._id == p.p_id;
    });
  });
  var box2 = box21.filter((v) => v);

  console.log('a');
  console.log(box2);
  res.render('User/userDetail', {
    userDetail: userDetail,
    user: user.id,
    projects: box,
    orderProject: orderData,
    progressProjects: box2,
    finishProject: finish,
  });
});

router.get('/userDetail/:email', isAuthenticated, async function (
  req,
  res,
  next
) {
  User.findOne({ email: req.params.email }, async (err, user) => {
    if (err) console.log('error');

    var userDetail = await UserDetail.findOne(
      { u_email: req.params.email },
      async (err, detail) => {
        if (!detail) {
          const createDetail = new UserDetail({
            u_email: req.params.email,
            name: '',
            detail: '',
            follow: [],
          });
          await createDetail.save();
        }
      }
    );
    var applicate = await Applicate.find({ email: req.params.email });
    var box = [];
    for (var e in applicate) {
      var a = await Project.findById(applicate[e].p_id);
      box.push(a);
    }

    const data = await Project.find({ userId: req.params.email });
    res.render('User/userDetail', {
      userDetail: userDetail,
      user: user.id,
      projects: box,
      orderProject: data,
    });
  });
});

router.get('/userDetail/edit/:id', isAuthenticated, async function (
  req,
  res,
  next
) {
  User.findById(req.params.id, (err, user) => {
    if (err) console.log('error');
    UserDetail.findOne({ u_email: user.email }, (err, userDetail) => {
      if (err) console.log('error');

      res.render('User/userEdit', {
        userDetail: userDetail,
        user: user._id,
        email: user.email,
      });
    });
  });
});

router.post('/userDetail/update/:id', async (req, res) => {
  const userDetail = await UserDetail.update(
    { u_email: req.body.u_email },
    {
      $set: {
        name: req.body.name,
        detail: req.body.detail,
      },
    },
    function (err) {
      if (err) {
        res.send(err);
        console.log(err);
      }
    }
  );
  res.redirect('/users/userDetail');
});

module.exports = router;
