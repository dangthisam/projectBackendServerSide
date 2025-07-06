
const md5=require("md5");
const bcrypt=require("bcrypt");
const User=require("../../models/user.model")

const PasswordReset = require('../../models/passwordReset');

const nodemailer = require('nodemailer');
const NumberHelp=require("../../helps/generate");

const helpSendMail=require("../../helps/sendMail");

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

const userProfile=async (req, res)=>{

  const user=await User.find({
    tokenUser:req.cookies.tokenUser,
    status:"active"
  })
  res.render("clients/pages/user/userprofile", {
    title:"Trang cá nhân",
    user:user
  })
}

const userForgotPassword=async (req, res)=>{
 

  res.render("clients/pages/user/forgotPassword", {
    title:"Quên mật khẩu"
  })
}


const userForgotPasswordPost=async (req, res)=>{
  
  const email=req.body.email;

  const user=await User.findOne({
    email,
    deleted:false
  })


  if(!user){
    req.flash("error", "Email không tồn tại")
    res.redirect("back")
    return;
  
  }

  //tao OTP
  const OTP = NumberHelp.generateRandomNumber(8);
  const expiresAt=Date.now()+120000;


  // luu vao trong db
  await PasswordReset.deleteMany({
    email
  })
const objectForgotPassword={
  email,
  otp:OTP,
  expiresAt:expiresAt

}
console.log(objectForgotPassword)

const passwordReset=new PasswordReset(objectForgotPassword);
const subject="Mã OTP để đặt lại mật khẩu"
const html=`Mã OTP để  láy lại mật khẩu là ${OTP}`

  helpSendMail.sendEmail(email, subject, html)
  

await passwordReset.save();



res.redirect(`/user/password/otp?email=${email}`)
// Gửi mail
  





  
}


const userPasswordOtp=async (req, res)=>{

  const email=req.query.email;
  
  res.render("clients/pages/user/enterNewpasswordOTP", {
    title:"Nhập OTP",
    email:email
  })
}



const userPasswordPost=async (req, res)=>{
  console.log(req.body)
  const email=req.body.email
  const otp=req.body.otp;

  const passwordReset=await PasswordReset.findOne({
    email:email,
    otp:otp
  })

  if(!passwordReset){
    req.flash("error", "OTP không đúng")
    res.redirect("back")
    return;
  }

  if(passwordReset.expiresAt<Date.now()){
    req.flash("error", "OTP đã hết hạn")
    res.redirect("back")
    return;
  }

  const user=await User.findOne({
    email:email,
    deleted:false
  })


  res.cookie("tokenUser" , user.tokenUser)

  res.redirect("/user/password/reset");

}

const userResetPassword=async (req,res)=>{
  res.render("clients/pages/user/enterNewpassword",{
    title:"Đổi mật khẩu"
  })
}

const userResetPasswordPost=async (req,res)=>{
  const password=md5(req.body.password);
const tokenUser=req.cookies.tokenUser;

await User.findOneAndUpdate({
  tokenUser:tokenUser
},{
  password:password
})


res.clearCookie("tokenUser")
req.flash("success", "Đổi mật khẩu thành công")
res.redirect("/user/login")

}


module.exports={
    userRegister,
    userRegisterPost,
    userLogin,
    userLoginPost, 
    logoutUser,
    userProfile,
    userForgotPassword,
    userForgotPasswordPost,
    userPasswordOtp,
    userPasswordPost,
    userResetPassword,
    userResetPasswordPost

} 