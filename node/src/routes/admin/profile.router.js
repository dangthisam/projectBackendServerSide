const express =require('express');
const router = express.Router();
const {detailProfile , editProfile, editPatchProfile} =require('../../controllers/admin/profile.controller');

const uploadClould=require("../../middleware/admin/uploadCloud.middleware");

const validateCreateProduct = require("../../validate/admin/create.validate");

const cloudinary = require('cloudinary').v2
const multer  = require('multer')
cloudinary.config({
    cloud_name:"domztsqxo",
    api_key :"698989336354439",
    api_secret:"uF-fEN7ADPBH45EZOyxb7i3UtEc"
})
const upload = multer()
router.get("/profile" , detailProfile);

router.get("/profile/edit",editProfile)

router.patch("/profile/edit",
     upload.single("avatar"),
     uploadClould.upload,
    
     editPatchProfile)
module.exports = router;