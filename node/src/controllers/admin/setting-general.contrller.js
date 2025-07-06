
const settingGenerals=require("../../models/setting-general.model");
const systemConfig = require("../../config/system");
const settingGeneral=async (req, res)=>{

   const setting=await settingGenerals.findOne({})
   res.render("admin/pages/settings/general.pug",{
    title:"Cài đặt chung",
    setting:setting,
    message: req.flash('message'),
    error: req.flash('error')
   })
}


const settingGeneralPatch=async (req, res)=>{
   console.log(req.body)
   const setting=await settingGenerals.findOne({})
   if(setting){
      await settingGenerals.updateOne({},{$set:req.body})
   }else{
      const newSetting=new settingGenerals(req.body)
      await newSetting.save()
   }

 
   res.redirect(`${systemConfig.prefixAdmin}/settings/general`)

  
}
module.exports={settingGeneral  , settingGeneralPatch  }
