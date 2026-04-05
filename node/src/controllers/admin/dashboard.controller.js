
const Productcategory=require("../../models/products-category-model")
const Product=require("../../models/products")
const Client=require("../../models/user.model")
const Admin=require("../../models/account")
const admin= async (req, res)=>{

const staticData={
    categoryProduct:{
        total:0,
        active:0,
        inactive:0
    },
    product:{
        total:0,
        active:0,
        inactive:0
    },
    client:{
        total:0,
        active:0,
        inactive:0
    },
    admin:{
        total:0,
        active:0,
        inactive:0
    }
    
}

staticData.categoryProduct.total=await Productcategory.countDocuments({
    deleted:false
})
staticData.categoryProduct.active=await Productcategory.countDocuments({
    deleted:false,
    status:"active"
})
staticData.categoryProduct.inactive=await Productcategory.countDocuments({
    deleted:false,
    status:"inactive"
})

staticData.product.total=await Product.countDocuments({
    deleted:false
})
staticData.product.active=await Product.countDocuments({
    deleted:false,
    status:"active"
})
staticData.product.inactive=await Product.countDocuments({
    deleted:false,
    status:"inactive"
})

staticData.client.total=await Client.countDocuments({
    deleted:false
})
staticData.client.active=await Client.countDocuments({
    deleted:false,
    status:"active"
})
staticData.client.inactive=await Client.countDocuments({
    deleted:false,
    status:"inactive"
})

staticData.admin.total=await Admin.countDocuments({
    deleted:false
})
staticData.admin.active=await Admin.countDocuments({
    deleted:false,
    status:"active"
})
staticData.admin.inactive=await Admin.countDocuments({
    deleted:false,
    status:"inactive"
})

    



    res.render('admin/pages/dashboard/index.pug', {
        title:"Sản phẩm nổi bật",
        titles:"Sản phẩm mới",
        static:staticData,
        message: req.flash('message'),
        error: req.flash('error')
    });
}

module.exports=admin