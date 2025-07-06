const express = require('express');
const router = express.Router();
const {settingGeneral  , settingGeneralPatch  }=require("../../controllers/admin/setting-general.contrller")
const uploadClould=require("../../middleware/admin/uploadCloud.middleware");
const multer  = require('multer')

const cloudinary = require('cloudinary').v2

const streamifier = require('streamifier')
const upload = multer()
cloudinary.config({
    cloud_name:"domztsqxo",
    api_key :"698989336354439",
    api_secret:"uF-fEN7ADPBH45EZOyxb7i3UtEc"
})
router.get("/settings/general",settingGeneral);

router.patch(
    "/settings/general",
     upload.single("logo"),
     uploadClould.upload,
     settingGeneralPatch
    
    );






module.exports = router;