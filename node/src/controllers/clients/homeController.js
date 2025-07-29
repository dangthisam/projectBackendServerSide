const ProductCategory = require("../../models/products-category-model");
const {search,toSlug} =require("../../helps/search")

  const productsHelper=require("../../helps/products")
const Product = require("../../models/products");


const index= async (req, res)=>{

    const find ={
        deleted:false,
        status:"active",
        featured:"1"
    }
     const productsFeatured=await Product.find(find);
const newProducts =productsHelper.priceNewProducts(productsFeatured)
const finds={
    deleted:false,
    status:"active",
    
}
const newProductCreate=await Product.find(finds).sort({position:"desc"}).limit(7)

const newProductCreates=productsHelper.priceNewProducts(newProductCreate)
   
   
    res.render('clients/pages/home/index.pug', {
        title:"Sản phẩm nổi bật",
        titles:"Sản phẩm mới",
       productsFeatured:newProducts,
       newProductCreate:newProductCreates
    });

}

const filterProducts = async (req, res) => {
 const slugCategory = toSlug(req.query.category);
 if (!slugCategory || slugCategory.trim() === '') {
       const products=await Product.find({
           deleted: false,
           status: "active"
       }).limit(7);
       return res.json({
           code: 200,
           data: products
       });
    }
    
    const categorys = await ProductCategory.findOne({
        slug: slugCategory,
        deleted: false
    });
    
    if (!categorys) {
        console.log('Category not found for slug:', slugCategory);
        return; // hoặc xử lý case không tìm thấy
    }
    console.log(categorys.id)
  const products=await Product.find({
    product_category_id:categorys.id,
    status:"active",
    deleted:false
  })
  res.json({
    code:200,
    data:products
  })
}


module.exports={index , filterProducts}