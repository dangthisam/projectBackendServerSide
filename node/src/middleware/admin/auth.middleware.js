const Account = require("../../models/account")
const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");
const authMiddleware = async (req, res, next) => {
  if (!req.cookies.token) {
    req.flash("error", "Bạn cần đăng nhập để thực hiện chức năng này");
    return res.redirect("/admin/auth/login");
  }
  else{

    const user = await Account.findOne({ token:  req.cookies.token }).select("-password ");
    if (!user) {
      req.flash("error", "Phiên đăng nhập không hợp lệ");
      return res.redirect("/admin/auth/login");
    }else{

        const role = await Role.findById({
          _id:user.role_id,
          deleted: false
        }).select(" title permissions");
        if (!role) {
          req.flash("error", "Vai trò không hợp lệ");
          return res.redirect("/admin/auth/login");
        }
        res.locals.role = role; // Lưu thông tin vai trò vào res.locals để sử dụng trong các view
        res.locals.user = user; // Lưu thông tin người dùng vào res.locals để sử dụng trong các view (tat cả các view sẽ có thể truy cập thông tin người dùng này)
        next();
    }
  }
};

module.exports = {
    authMiddleware,
};

