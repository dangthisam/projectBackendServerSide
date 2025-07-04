// Ensure this file exports the authLogin method
module.exports.userValidation=(req,res , next) =>{
    if(!req.body.email){
        req.flash('error', 'Vui lòng nhập tên đăng nhập!');
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }
    if(!req.body.fullName){
        req.flash('error', 'Vui lòng nhập họ tên!');
        res.redirect("back");
        return;
    }
  
    next();
    // other exports
    
};


