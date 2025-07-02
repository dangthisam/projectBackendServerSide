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
   
    console.log(productsFeatured)
    res.render('clients/pages/home/index.pug', {
        title:"Sản phẩm nổi bật",
       productsFeatured:newProducts
    });
}

module.exports={index}