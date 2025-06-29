const ProductCategory = require("../../models/products-category-model");



const index= async (req, res)=>{
 
    
    res.render('clients/pages/home/index.pug', {
        title:"trang chu nha",
       
    });
}

module.exports={index}