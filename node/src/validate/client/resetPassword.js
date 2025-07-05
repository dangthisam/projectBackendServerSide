

module.exports.resetPassword=async (req,res, next)=>{
    if(!req.body.password){
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    
    }
    if(!req.body.confirm_password){
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }
  
    if(req.body.password!==req.body.confirm_password){
        req.flash('error', 'Mật khẩu không khớp!');
        res.redirect("back");
        return;
    }
    next();
    // other exports
    
};
