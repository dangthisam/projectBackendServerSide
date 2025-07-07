
  const Product =require("../../models/products");
  const ProductCategory=require("../../models/products-category-model")
  const productsHelper=require("../../helps/products")
  const categoryHelper=require("../../helps/products-category")
  
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

const category = async (req, res) => { 
  try {
    const slug = req.params.slugCategory;
    
    // Find the category
    const category = await ProductCategory.findOne({
      slug: slug,
      status: "active",
      deleted: false
    });

    // Check if category exists
    if (!category) {
     res.send("Lỗi không tìm thấy danh mục sản phẩm");
      return res.status(404)
      };
      // Alternative: redirect to products page
      // return res.redirect('/products');
    

    // Get subcategories
    const listCategory = await categoryHelper.getSubCategory(category.id);

    // Process subcategories
    let listCategoryId = [];
    if (listCategory && Array.isArray(listCategory)) {
      listCategoryId = listCategory
        .filter(item => item && item.id) // Filter items with valid id
        .map(item => item.id);
    }

    // Find products in this category and its subcategories
    const products = await Product.find({
      deleted: false,
      product_category_id: { $in: [category.id, ...listCategoryId] }, 
      status: "active"
    }).sort({ position: "desc" });

    // Process products (assuming this adds pricing info)
    const newProducts = productsHelper.priceNewProducts(products);

    // Render the page
    res.render('clients/pages/products/index', {
      title: category.title,
      products: newProducts
    });

  } catch (error) {
    console.error('Error in category controller:', error);
  res.send("Lỗi không tìm thấy danh mục sản phẩm");
    res.status(500).json({
      success: false,
    });
  }
};



const getProductBySlug = async (req, res) => {
   
    try {
      const slug = req.params.slugProduct;
      const find = {
        deleted: false,
        slug: slug
      };
      const product = await Product.findOne(find);

      if(product.product_category_id){
       
        const category = await ProductCategory.findOne({
          _id: product.product_category_id,
          status: "active",
          deleted: false
        });
        product.category = category;

      }

    
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



module.exports={productEdit,homeProducts , getProductBySlug , category };