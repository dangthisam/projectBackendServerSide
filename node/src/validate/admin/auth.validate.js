// Ensure this file exports the authLogin method
module.exports.authLogin=(req,res , next) =>{
    if(!req.body.email){
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }
  
    next();
    // other exports
    
};


