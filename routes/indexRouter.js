var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');


/* GET home page. */

router.get('/',async function (req, res, next) {
  var projects = await Project.find({});
  var user;
  if (req.user == null){
    user = ""
  }else{
    user = req.user['type']
  }
  console.log(user);
  console.log("aaaaa");
  res.render('index', { projects: projects , user:user});
});

router.get('/projectDetail/:id', async function (req, res, next) {
  var project = await Project.find({});
  res.render('projectDetail', { projects: project[req.params.id] });
});

router.get('/choose', function (req, res, next) {
  res.render('choose', { title: 'Express' });
});

router.get('/session', async function (req, res, next) {
  console.log(req.user['type']);
  console.log(req.user['email']);
  var project = await Project.find({});
  res.render('index', { projects: project });
});

module.exports = router;
