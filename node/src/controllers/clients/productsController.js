
  const Product =require("../../models/products");
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
    res.render('clients/pages/products/index', {
        products: products
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
module.exports={productEdit,homeProducts , getAllProducts};