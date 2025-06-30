
  const Product =require("../../models/products");
  const productsHelper=require("../../helps/products")
  
const productEdit=(req, res)=>{
    res.render('clients/pages/products/edit',{
        
        title:"Products"
    }
    ); 
}

const homeProducts= async (req,res)=>{
  const products =await Product.find({
   status:"active",
   deleted:false,

}).sort({position:"desc"});

const newProducts =productsHelper.priceNewProducts(products)
    res.render('clients/pages/products/index', {
        products: newProducts,
        title:"Products"
    });


}





const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      console.log(products);
      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
     
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách sản phẩm: ' + error.message,
      });
    }
  };
const getProductBySlug = async (req, res) => {
    const slug = req.params.slug;
    try {
      const slug = req.params.slug;
      const find = {
        deleted: false,
        slug: slug
      };
      const product = await Product.findOne(find);

      //console.log(product);
      console.log(product);
      res.render('clients/pages/products/detail', {
        pageTitle: "Detail Product",
        product: product,
        status:"active"
      });
    } catch (err) {
      console.log(err);

        res.status(500).send("Server Error");
        res.send("Lỗi không tìm thấy sản phẩm");
        res.redirect("/products");
      }
  }
module.exports={productEdit,homeProducts , getAllProducts , getProductBySlug};