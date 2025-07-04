
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
req.flash("success" , "Đăng ký thành công");
res.redirect("back")

  
}




module.exports={
    userRegister,
    userRegisterPost

}