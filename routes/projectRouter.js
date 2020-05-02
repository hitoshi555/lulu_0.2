var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');

const Applicate = require('../model/applicateSchema');
const UserDetail = require('../model/userDetailSchema');

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

router.get('/new', isAuthenticated, function (req, res, next) {
  var email = req.user['email'];
  console.log(email);
  return res.render('Project/projectAdd', { email: email });

});
router.post('/create', async function (req, res, next) {
  if (req.body.corporateCaseFlag == undefined) {
    req.body.corporateCaseFlag = false;
  }

  const createProject = new Project({
    projectName: req.body.projectName,
    amount: req.body.amount,
    createDate: Date.now(),
    editDate: Date.now(),
    finishFlag: false,
    corporateCaseFlag: req.body.corporateCaseFlag,
    detail: req.body.detail,
    demandSkill: req.body.demandSkill,
    applicants: req.body.applicants,
    paymentDate: req.body.paymentDate,
    userId: 'hitoshi@hitohi',
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


    var applicates = await Applicate.find({ p_id: project._id });
    var detailarry = [];
    for (var i in applicates) {
      var userDetail = await UserDetail.find({ u_email: applicates[i].email });

      detailarry.push(userDetail);
    }
    res.render('Project/projectDetail', {
      project: project,
      userdetail: detailarry,
    });

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
  if (req.body.corporateCaseFlag == undefined) {
    req.body.corporateCaseFlag = false;
  }

  const project = await Project.update(
    { _id: req.params.projectID },
    {
      $set: {
        projectName: req.body.projectName,
        amount: req.body.amount,
        createDate: req.body.createDate,
        editDate: Date.now(),
        finishFlag: false,
        corporateCaseFlag: req.body.corporateCaseFlag,
        detail: req.body.detail,
        demandSkill: req.body.demandSkill,
        applicants: req.body.applicants,
        paymentDate: req.body.paymentDate,
        userId: 'hitoshi@hitohi',
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


router.post('/:projectID/application', isAuthenticated, async (req, res) => {
  //次回、応募ずみなら弾く
  await Project.findById(req.params.projectID, (err, project) => {
    if (err) console.log('error');
    if (project.userId == req.user['email']) {
      req.flash('err', '発注者と応募者が一緒です。');
      return res.redirect('/:projectID', { project: project });
    } else {
      var applicant = new Applicate({
        p_id: project._id,
        email: req.user['email'],
        flag: false,
      });
      //await ないのが不安
      applicant.save();
      return res.redirect('/project/' + project._id);
    }
  });
});


module.exports = router;
