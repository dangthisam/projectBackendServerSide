
const Productcategory=require("../../models/products-category-model")
const Product=require("../../models/products")
const Client=require("../../models/user.model")
const Admin=require("../../models/account")
const admin= async (req, res)=>{

const static={
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

static.categoryProduct.total=await Productcategory.countDocuments({
    deleted:false
})
static.categoryProduct.active=await Productcategory.countDocuments({
    deleted:false,
    status:"active"
})
static.categoryProduct.inactive=await Productcategory.countDocuments({
    deleted:false,
    status:"inactive"
})

static.product.total=await Product.countDocuments({
    deleted:false
})
static.product.active=await Product.countDocuments({
    deleted:false,
    status:"active"
})
static.product.inactive=await Product.countDocuments({
    deleted:false,
    status:"inactive"
})

static.client.total=await Client.countDocuments({
    deleted:false
})
static.client.active=await Client.countDocuments({
    deleted:false,
    status:"active"
})
static.client.inactive=await Client.countDocuments({
    deleted:false,
    status:"inactive"
})

static.admin.total=await Admin.countDocuments({
    deleted:false
})
static.admin.active=await Admin.countDocuments({
    deleted:false,
    status:"active"
})
static.admin.inactive=await Admin.countDocuments({
    deleted:false,
    status:"inactive"
})

    



    res.render('admin/pages/dashboard/index.pug', {
        title:"Sản phẩm nổi bật",
        titles:"Sản phẩm mới",
        static:static,
        message: req.flash('message'),
        error: req.flash('error')
    });
}

module.exports=admin