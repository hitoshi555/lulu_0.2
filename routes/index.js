var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');


//認証機能
// function isAuthenticated(req, res, next){
//   if (req.isAuthenticated()) {  // 認証済
//       return next();
//   }
//   else {  // 認証されていない
//       res.redirect('/users/userSingin');  // ログイン画面に遷移
//   }
// }

/* GET home page. */
router.get('/', async function(req, res, next) {
  var project = await Project.find({});
  res.render('index',{ project : project });
});

router.get('/choose', function(req, res, next) {
  res.render('choose', { title: 'Express' });
});

module.exports = router;
