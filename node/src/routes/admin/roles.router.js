const express = require('express');
const { indexRoles , createRole , createPost } = require('../../controllers/admin/roles.controller');
const { create } = require('../../models/role.model');
const router = express.Router();

router.get('/roles', indexRoles);
router.get('/roles/create', createRole);
router.post('/roles/create', createPost)
module.exports = router;