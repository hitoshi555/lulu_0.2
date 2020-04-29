var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');

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
router.get('/', async function (req, res, next) {
  var projects = await Project.find({});
  res.render('Project/project', { projects: projects });
});
//create
router.get('/new', isAuthenticated ,function (req, res, next) {
  var email = req.user['email']
  console.log(email);
  return res.render('Project/projectAdd',{email:email});
});

router.post('/create', async function (req, res, next) {
  console.log(req.body.corporateCaseFlag);
  var checkflag = false;
  if (req.body.corporateCaseFlag == 'on') {
    checkflag = true;
  }
  const createProject = new Project({
    projectName: req.body.projectName,
    amount: req.body.amount,
    createDate: Date.now(),
    editDate: Date.now(),
    finishFlag: false,
    corporateCaseFlag: checkflag,
    detail: req.body.detail,
    demandSkill: req.body.demandSkill,
    applicants: req.body.applicants,
    paymentDate: req.body.paymentDate,
    userId: req.user['email'],
  });
  console.log(createProject);
  const savedProject = await createProject.save();
  var projects = await Project.find({});
  res.redirect('/project');
  res.render('index', { projects: projects });
});

//detail
router.get('/:projectID', (req, res) => {
  Project.findById(req.params.projectID, (err, project) => {
    if (err) console.log('error');
    res.render('Project/projectDetail', { project: project });
  });
});

//delete
router.post('/:projectID/delete', async (req, res) => {
  const project = await Project.remove({ _id: req.params.projectID });
  res.redirect('/project');
  res.render('index', { projects: project });
  res.render('Project/project', { projects: project });
});
//update
router.get('/:projectID/edit', async function (req, res, next) {
  Project.findById(req.params.projectID, (err, project) => {
    if (err) console.log('error');
    res.render('Project/projectEdit', { project: project });
  });
});

router.post('/:projectID/update', async (req, res) => {
  const project = await Project.update(
    { _id: req.params.projectID },
    {
      $set: {
        projectName: req.body.projectName,
        amount: req.body.amount,
        createDate: req.body.createDate,
        editDate: Date.now(),
        finishFlag: false,
        corporateCaseFlag: req.body.checkflag,
        detail: req.body.detail,
        demandSkill: req.body.demandSkill,
        applicants: req.body.applicants,
        paymentDate: req.body.paymentDate,
        userId: req.body.userId,
      },
    },
    function (err) {
      if (err) {
        res.send(err);
        console.log(err);
      }
    }
  );
  res.redirect('/project');
  res.render('index', { projects: projects });
});

module.exports = router;
