
  const Product =require("../../models/products");
  const ProductCategory=require("../../models/products-category-model")
  const productsHelper=require("../../helps/products")
  const {search,toSlug} =require("../../helps/search")

  const searchProducts=async(req,res)=>{
    const keyword=toSlug(req.query.keyword);
    
    let newProducts=[];
    if(keyword){
        const regex=new RegExp(keyword,"i");
        const products=await Product.find({
            deleted:false,
            status:"active",
            slug:regex

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