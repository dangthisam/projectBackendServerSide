const Account = require('../../models/account');
const Role = require('../../models/role.model');
const md5 = require('md5');
const systemConfig = require("../../config/system");

const indexRouter = async (req, res) => {
    const find ={
        deleted:false
    }
    const records=await Account.find(find).select("-pasword -token")

    for (const item of records) {
      const findRole = {
        _id: item.role_id,
        deleted: false
      };
      const role = await Role.findOne(findRole);
      item.role=role


    }
    res.render('admin/pages/accounts/index', {
        title: 'Quản lý tài khoản',
        records:records
    })
}

const createAccount = async (req, res) => {

  const roles = await Role.find({ deleted: false });
  res.render('admin/pages/accounts/create', {
    title: 'Tạo tài khoản mới',
    roles: roles
  });
}


//start create account
const createAccountPost = async (req, res) => {


  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false
  });
  if (emailExist) {
    req.flash('error', 'Email đã tồn tại');
  } else {
    password = md5(req.body.password);
    req.body.password = password;
    const records = new Account(req.body);
    await records.save();
    req.flash('success', 'Tạo tài khoản thành công');
  }
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    // res.send('Tạo tài khoản thành công');
  }

//end create account

module.exports = { indexRouter, createAccount, createAccountPost };