
const Role = require('../../models/role.model');


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

module.exports = {
  indexRoles,
  createRole,
    createPost
}