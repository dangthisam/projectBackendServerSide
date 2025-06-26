// Ensure this file exports the createProducts method
module.exports.createProducts=(req,res , next) =>{
    if(!req.body.username){
        req.flash('error', 'Vui lòng nhập tên đăng nhập!');
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect("back");
        return;
    }
    if(!req.body.role_id){
        req.flash('error', 'Vui lòng chọn quyền!');
        res.redirect("back");
        return;
    }
    if(!req.body.status){
        req.flash('error', 'Vui lòng chọn trạng thái!');
        res.redirect("back");
        return;
    }
    next();
    // other exports
    
};
