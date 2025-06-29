const ProductCategory = require("../../models/products-category-model");
module.exports.Category= async (req, res , next)=>{
    let count=0;

      const productsCategory = await ProductCategory.find({ deleted: false });
        function createTree(arr, parentId = "") {
            const tree = [];
            arr.forEach((item) => {
            if (item.parent_id === parentId) {  
              count++;
            const newItem = item;
            newItem.index=count
            const children = createTree(arr, item.id);
            if (children.length > 0) {
            newItem.children = children;
            }
            tree.push(newItem);
          }
            });
            return tree;
              }
    
              const newProductsCategory = createTree(productsCategory);

              res.locals.records = newProductsCategory;
              next();

}

