var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('project');
});

router.post('/', async function(req, res, next){
  console.log(req.body.corporateCaseFlag);
  var checkflag = false;
  if(req.body.corporateCaseFlag == "on"){
    checkflag = true;
  }
  const project = new Project({
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
    userId:"hitoshi@hitohi",
  });
  console.log(project);
  const savedProject = await project.save();

  res.render('index',{data:savedProject});
});

router.get('/detail', function(req, res, next) {
  res.render('projectDetail');
});

module.exports = router;