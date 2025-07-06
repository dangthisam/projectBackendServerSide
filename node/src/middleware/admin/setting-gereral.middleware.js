const settingGenerals=require("../../models/setting-general.model")

module.exports.settingGeneral=async(req, res , next)=>{

    const setting=await settingGenerals.findOne({})

    if (setting){

        res.locals.settingereral=setting
        next()
    }else{
        next()
    }
}
