const express = require('express');
const { indexRoles , createRole , createPost , detailRoles , editRole , editPathRoles , deleteRoles } = require('../../controllers/admin/roles.controller');
const { create } = require('../../models/role.model');
const router = express.Router();

router.get('/roles', indexRoles);
router.get('/roles/create', createRole);
router.post('/roles/create', createPost)

// start detail role
router.get('/roles/detail/:id', detailRoles)
//end detail role

   //  start edit role
router.get("/roles/edit/:id", editRole);
router.patch("/roles/edit/:id", editPathRoles);

//end edit products

router.delete('/roles/delete/:id', deleteRoles);
module.exports = router;