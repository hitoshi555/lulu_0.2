var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  var email = req.user['email'];
  console.log(email);
  res.render('project',{email: email});
});

router.post('/', async function(req, res, next){
  console.log(req.body.email);
  var checkflag = false;
  if(req.body.corporateCaseFlag == "on"){
    checkflag = true;
  }
  const createProject = new Project({
    projectName: req.body.projectName,
    amount: req.body.amount,
    createDate: Date.now(),
    editDate: Date.now(),
    finishFlag: false,
    corporateCaseFlag: checkflag,
    detail:req.body.detail,
    demandSkill: req.body.demandSkill,
    applicants: req.body.applicants,
    paymentDate: req.body.paymentDate,
    userId: req.body.email,
  });
  console.log(createProject);
  const savedProject = await createProject.save();
  var project = await Project.find({});
  res.render('index', { projects: project });
  
});




module.exports = router;