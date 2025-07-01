
  const Product =require("../../models/products");
  const ProductCategory=require("../../models/products-category-model")
  const productsHelper=require("../../helps/products")
  const categoryHelper=require("../../helps/products-category")

  const searchProducts=async(req,res)=>{
    const keyword=req.query.keyword;
    let newProducts=[];
    if(keyword){
        const regex=new RegExp(keyword,"i");
        const products=await Product.find({
            deleted:false,
            status:"active",
            title:regex

    })

    newProducts=productsHelper.priceNewProducts(products)

}

res.render("clients/pages/products/search",{
    pageTitle:"Kết quả tìm kiếm",
    keyword:keyword,
    products:newProducts
})
  }

  module.exports={searchProducts};