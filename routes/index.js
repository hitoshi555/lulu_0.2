var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');


//認証機能
function isAuthenticated(req, res, next){
  if (req.isAuthenticated()) {  // 認証済
      return next();
  }
  else {  // 認証されていない
      res.redirect('/users/userSingin');  // ログイン画面に遷移
  }
}

/* GET home page. */
router.get('/', isAuthenticated,async function(req, res, next) {
  var projects = await Project.find({});
  res.render('index',{ projects : projects });
});


router.get('/projectDetail/:id', async function(req, res, next) {
  var project = await Project.find({});
  res.render('projectDetail',{ projects : project[req.params.id] });
 
});
router.get('/choose', function(req, res, next) {
  res.render('choose', { title: 'Express' });
});

router.get('/session', async function(req, res, next){
  console.log(req.user['email'])
  var project = await Project.find({});
  res.render('index',{ projects : project });
})

module.exports = router;
