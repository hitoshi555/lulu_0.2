var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');
const Applicate = require('../model/applicateSchema');
const UserDetail = require('../model/userDetailSchema');
const User = require('../model/userSchema');
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
  var projects = await Project.find({ finishFlag: false });

  var company = await User.find({ type: 'company' });

  const a = projects.filter((value, index, array) => {
    return value.corporateCaseFlag == true && value.finishFlag == false;
  });

  var aa = '';
  if (req.user) {
    aa = req.user['email'];
  }
  var tt = [];
  for (var f in a) {
    var d = await UserDetail.findOne({ u_email: a[f].userId });
    if (d.follow.includes(aa)) {
      tt.push(a[f]);
    }
  }
  res.render('Project/project', { projects: projects, privateprojects: tt });
});
//create

router.get('/new', isAuthenticated, function (req, res, next) {
  var email = req.user['email'];
  return res.render('Project/projectAdd', { email: email, user: req.user });
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
    userId: req.user['email'],
  });
  const savedProject = await createProject.save();
  var projects = await Project.find({});
  res.redirect('/project');
  res.render('index', { projects: projects });
});

//detail
router.get('/:projectID', isAuthenticated, (req, res) => {
  Project.findById(req.params.projectID, async (err, project) => {
    if (err) console.log('error');
    var applicates = await Applicate.find({ p_id: project._id });

    var detailarry = [];
    for (var i in applicates) {
      var userDetail = await UserDetail.find({ u_email: applicates[i].email });
      detailarry.push(userDetail);
    }

    if (project.userId == req.user['email']) {
      res.render('Project/orderProjectDetail', {
        project: project,
        userdetail: detailarry,
      });
    } else {
      res.render('Project/projectDetail', {
        project: project,
        userdetail: detailarry,
      });
    }
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

router.post('/:projectID/update', isAuthenticated, async (req, res) => {
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
        userId: req.user['email'],
      },
    },
    function (err) {
      if (err) {
        res.send(err);
        console.log(err);
      }
    }
  );

  //どっちも動作してんの？？
  res.redirect('/project');
  res.render('index', { projects: projects });
});
//応募ボタン
router.post('/:projectID/application', isAuthenticated, async (req, res) => {
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
      applicant.save();
      return res.redirect('/project/' + project._id);
    }
  });
});
//発注ボタン
router.post('/:projectID/orderProject', isAuthenticated, async (req, res) => {
  const applicate = await Applicate.update(
    { email: req.body.email, p_id: req.params.projectID },
    {
      $set: {
        p_id: req.params.projectID,
        email: req.body.email,
        flag: true,
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
});

router.post('/:projectID/finishProject', isAuthenticated, async (req, res) => {
  const p = await Project.findById(req.params.projectID);
  const project = await Project.update(
    { _id: req.params.projectID },
    {
      $set: {
        projectName: p.projectName,
        amount: p.amount,
        createDate: p.createDate,
        editDate: p.editDate,
        finishFlag: true,
        corporateCaseFlag: p.corporateCaseFlag,
        detail: p.detail,
        demandSkill: p.demandSkill,
        applicants: p.applicants,
        paymentDate: p.paymentDate,
        userId: p.userId,
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
});
module.exports = router;
