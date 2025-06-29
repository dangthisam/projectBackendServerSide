
const Account=require("../../models/account")
const md5=require("md5")
const systemConfig = require("../../config/system");


const detailProfile = async (req, res) => {

   res.render('admin/pages/profile/profile.pug',{
      pageTitle: "Profile"
   });
}


const editProfile = async (req, res) => {

    res.render('admin/pages/profile/edit-profile.pug',{
      pageTitle: "Edit Profile"
   });
}

const editPatchProfile = async (req, res) => {

     const id = res.locals.user.id;
     
       const emailExist = await Account.findOne({
        _id: { $ne: id }, // Đảm bảo không kiểm tra chính tài khoản đang chỉnh sửa
          email: req.body.email,
          deleted: false
      });
      if (emailExist) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect(`${systemConfig.prefixAdmin}/profile/edit/${id}`);
      }
     else{
      if(req.body.password){
        req.body.password = md5(req.body.password);
      }else{
        delete req.body.password; // Xóa trường password nếu không có giá trị
      }
      // Cập nhật thông tin tài khoản
      await Account.updateOne({ _id: id }, req.body);
      req.flash('success', 'Cập nhật tài khoản thành công');
      res.redirect(`${systemConfig.prefixAdmin}/profile`);
     }
}




module.exports = {detailProfile , editProfile , editPatchProfile};