const express =require("express")
const router = express.Router();
const {indexAbout} =require("../../controllers/clients/about.controller")

router.get("/", indexAbout);

module.exports = router;
