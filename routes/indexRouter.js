var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');
const User =require('../model/userSchema');
const UserDetail =require('../model/userDetailSchema');


/* GET home page. */

router.get('/',async function (req, res, next) {
  var projects = await Project.find({});
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

  var user;
  if (req.user == null){
    user = ""
  }else{
    user = req.user['type']
  }
  res.render('index', { projects: projects , user:user , companyDetail:companyDetail});
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
