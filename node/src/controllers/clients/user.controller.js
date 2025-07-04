
const md5=require("md5");
const bcrypt=require("bcrypt");
const User=require("../../models/user.model")
const userRegister=async (req, res)=>{
  
    res.render('clients/pages/user/register',{
        title:"Đăng ký tài khoản"
      })
}


const userRegisterPost=async (req, res)=>{
  const exitsEmail=await User.findOne({
    email:req.body.email
  });
  
  if(exitsEmail){
    req.flash("error" , "Email đã tồn tại ")
    res.redirect("back")
    return;
  }

req.body.password=md5(req.body.password);
const user=new User(req.body);
await user.save();
// res.cookie("tokenUser" , user.tokenUser)
req.flash("success" , "Đăng ký thành công");
res.redirect("back")

  
}


const userLogin=async (req, res)=>{
    res.render('clients/pages/user/login',{
      title:"Đăng nhập tài khoản"
    })
}

const userLoginPost=async (req, res)=>{
  
 const email=req.body.email;
 const password=md5(req.body.password);

 const user=await User.findOne({
  email,
deleted:false,
 });

 if(!user){
  req.flash("error", "Email không tồn tại")
  res.redirect("back")
  return;
 }

 if(user.password!==password){
  req.flash("error", "Mật khẩu không đúng")
  res.redirect("back")
  return;
 }

 if(user.status=="inactive"){
  req.flash("error", "Tài khoản chưa được kích hoạt")
  res.redirect("back")
  return;
 }
 res.cookie("tokenUser" , user.tokenUser)
 req.flash("success" , "Đăng nhập thành công");
 res.redirect("/home")
  
}

const logoutUser=async (req, res)=>{
 res.clearCookie("tokenUser")
 req.flash("success" , "Đăng xuất thành công");
 res.redirect("/home")
}
module.exports={
    userRegister,
    userRegisterPost,
    userLogin,
    userLoginPost, 
    logoutUser

} 