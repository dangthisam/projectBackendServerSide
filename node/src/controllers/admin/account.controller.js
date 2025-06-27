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

//start edit account

const detailAccount = async (req, res) => {

   const id = req.params.id;
    
    const find = {
      deleted: false,
      _id: id
    };
  
    const account = await Account.findOne(find).select("-password -token");
    //console.log(product);

   const findRole = {
     _id: account.role_id,
     deleted: false
   };
   const role = await Role.findOne(findRole);
   account.role=role


    
    res.render('admin/pages/accounts/detail', {
        title: 'Quản lý tài khoản',
        account:account
    })
  }
const editAccount = async (req, res) => {
  const id = req.params.id;
  const find = {
    _id: id,
    deleted: false
  };
  const record = await Account.findOne(find);
  const roles = await Role.find({ deleted: false });

  res.render('admin/pages/accounts/edit', {
    title: 'Chỉnh sửa tài khoản',
    record: record,
    roles: roles
  });
};

const changestatusAccount = async (req, res) => {
  const { status, id } = req.params;
    const find = {
        _id: id,
        deleted: false
    };
    await Account.updateOne(find, { status: status });
    req.flash('success', 'Cập nhật trạng thái tài khoản thành công');
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}

//end edit account



const editAccountPath = async (req, res) => {
  const id = req.params.id;
 
   const emailExist = await Account.findOne({
    _id: { $ne: id }, // Đảm bảo không kiểm tra chính tài khoản đang chỉnh sửa
      email: req.body.email,
      deleted: false
  });
  if (emailExist) {
    req.flash('error', 'Email đã tồn tại');
    return res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
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
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
 }

};

const deleteAccount = async (req, res) => {
  const id = req.params.id;
  const find = {
    _id: id,
    deleted: false
  };
  // Cập nhật trường deleted thành true để đánh dấu là đã xóa
  await Account.updateOne(find, { deleted: true });
  req.flash('success', 'Xóa tài khoản thành công');
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};

module.exports = { indexRouter, createAccount, createAccountPost, editAccount, editAccountPath , detailAccount, deleteAccount  , changestatusAccount };