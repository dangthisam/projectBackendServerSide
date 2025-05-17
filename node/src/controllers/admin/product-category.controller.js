
const systemConfig = require("../../config/system");

const ProductCategory = require("../../models/products-category-model");

// const validate = require("../../validates/product.validate");
const productCategoryAdmin= async (req,res)=>{ 

    const find={
      deleted:false
    }
    const records= await ProductCategory.find(find);
    res.render('admin/pages/products/index-category', { 
      pageTitle:"Danh mục sản phẩm",
      records:records
     });
  }

const createCategoryAdmin=async(req,res)=>{
   res.render('admin/pages/products/createCategory', { 
      pageTitle:"Tao danh muc moi"
     });
}

const postcreateCategoryAdmin=async(req,res)=>{
  if(req.body.position==""){
    const count=await ProductCategory.countDocuments();
    req.body.position=count+1;
  }else{
    req.body.position=parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
   await record.save();

   req.flash('success', `Thêm sản phẩm thành công!`);
   res.redirect(`${systemConfig.prefixAdmin}/products-category`);

}

  module.exports={productCategoryAdmin , createCategoryAdmin , postcreateCategoryAdmin}


 