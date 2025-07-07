
const Role = require('../../models/role.model');

const systemConfig = require("../../config/system");

const indexRoles = async (req, res) => {
  let find={
    deleted: false
  }
  const records = await Role.find(find);
  res.render('admin/pages/roles/index', {
    title: 'Quản lý vai trò',
    records: records,
    message: req.flash('message'),
    error: req.flash('error')
  });
}

const createRole = async (req, res) => {
  res.render('admin/pages/roles/create', {
    title: 'Tạo vai trò mới',
    message: req.flash('message'),
    error: req.flash('error')
  });
}

const  createPost= async (req, res) => {
  const records=new  Role(req.body)
  await records.save();
  res.redirect('/admin/roles');
}

const detailRoles = async (req, res) => {
  const id = req.params.id;
  const find = {
    deleted: false,
    _id: id
  };
  const record = await Role.findOne(find);
  if (!record) {
    req.flash('error', 'Vai trò không tồn tại');
    return res.redirect('/admin/roles');
  }

  res.render('admin/pages/roles/detailRoles', {
    title: 'Chi tiết vai trò',
    record: record,
    message: req.flash('message'),
    error: req.flash('error')
  });
}

//start edit role
const editRole = async (req, res) => {
   try{    
          const id = req.params.id;
          const find = {
            deleted: false,
            _id: id
          };
  const record = await Role.findOne(find);
  
  res.render('admin/pages/roles/editRoles', {
    title: 'Chỉnh sửa vai trò',
    record: record,
    message: req.flash('message'),
    error: req.flash('error')
  });
} catch (err) {
  console.log(err);

  res.status(500).send("Server Error");
  res.send("Lỗi không tìm thấy vai trò");
}
}

const editPathRoles = async (req, res) => {
  const id = req.params.id;

 

  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash('success', `Cập nhật vai trò thành công`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error('Error updating role:', error);
    req.flash('error', 'Cập nhật vai trò thất bại');
    return res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}
 
//end edit role

const deleteRoles = async(req, res)=>{
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });
    // res.redirect("back");
    await Role.updateOne(
      { _id:id },
      { deleted: true },
      { deletedAt: new Date() } // Cập nhật thời gian xóa
    );
    req.flash('success', `da xoa thành cong vai tro`);
    // trở về trang trước đó
    // redirect là chuyển hướng đến một trang khác
    res.redirect("back" );
  }



  //start roles permissions
const rolesPermissions = async (req, res) => {
  const find = {
    deleted: false
  };
  const roles = await Role.find(find);
  res.render('admin/pages/roles/permissions', {
    title: 'Quản lý quyền của vai trò',
    roles: roles,
    message: req.flash('message'),
    error: req.flash('error')
  });
}
  //end roles permissions

const rolesPermissionsPath = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for (const item of permissions) {
    const id= item.id;
    
    await Role.updateOne(
      { _id: id },
      { permissions: item.permissions }
    );
    
  }
 
    res.redirect('/admin/roles/permissions');
  // res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);  
}
module.exports = {
  indexRoles,
  createRole,
  createPost,
  detailRoles,
  editRole,
  editPathRoles,
  deleteRoles,
  rolesPermissions,
  rolesPermissionsPath
}