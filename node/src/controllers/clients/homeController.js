const ProductCategory = require("../../models/products-category-model");

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


module.exports={index}