var express = require('express');
var router = express.Router();
const Project = require('../model/projectSchema');
const User =require('../model/userSchema');
const UserDetail =require('../model/userDetailSchema');


/* GET home page. */

router.get('/',async function (req, res, next) {
  var projects = await Project.find({});
  var company = await User.find({type:"company"});

  //プライベート案件
  // const t = projects.filter(async (value, index, array)=>{
  //   var f = await UserDetail.findOne({u_email:value.userId});
  //   f.follow.includes(req.user['email']);
  //   if(value.projectName == "jjj"){
  //     console.log("aa")
  //   }
  //   // return (value.projectName == "jjj");
  //   return value.projectName == "jjj";
  // });

  const a = projects.filter((value, index, array)=>{
    return value.corporateCaseFlag == true;
  });

 let b = projects.filter((value, index, array)=>{
    return value.corporateCaseFlag == false;
  });

  var aa=""
  if(req.user){
    aa=req.user['email'];
  }
  var tt =[];
  for(var f in a){
    var d = await UserDetail.findOne({u_email:a[f].userId})
    if(d.follow.includes(aa)){
      tt.push(a[f]);
    }
  }
  const arr = b.concat(tt);
  console.log(arr)
  // console.log(t)

  

  // var f = UserDetail.findOne({u_email:displayProject.userId},async (err, user)=>{
  //   console.log(user.)
  // });


  //userid のuserdetailの中にあるfillterにreq.user['email']
  //があったら外にだす

  var companyDetail = [];
  for (var i in company){
    var detail = await UserDetail.findOne({u_email:company[i].email})
    if(detail !=null){
      companyDetail.push(detail);
    }else{
      const createDetail = new UserDetail({
        u_email:company[i].email,
        name:"",
        detail:"",
        follow:[]
      });
      detail = await createDetail.save();
      companyDetail.push(detail);
    }
  }

  var user;
  if (req.user == null){
    user = ""
  }else{
    user = req.user['type']
  }
  res.render('index', { projects: arr , user:user , companyDetail:companyDetail});
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
