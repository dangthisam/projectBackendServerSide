
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/products-category-model");
const filter =require("../../helps/filterStatus");
const search =require("../../helps/search");
const pagination=require("../../helps/pagination");
// const validate = require("../../validates/product.validate");
const productCategoryAdmin= async (req,res)=>{ 

  // start filter status ON or OFF    
 filterStatus =filter(req.query.status);
    const find={
      deleted:false
    }

    if (req.query.status) {
        find.status = req.query.status;  
    }
//end filter status ON or OFF


     // start search products
        const objectSearch =search(req.query);
        
            if(objectSearch.regex){
              find.title=objectSearch.regex;
            }
    //end search products
 
    //start pagination 
 const countProducts = await ProductCategory.countDocuments(find);
  let objectPagination = pagination(
        {
          currentPage:1,
          limitPage:4
        },
        req.query,
        countProducts
      )
    //end pagination
  
    
//start sort 
sort={};
    if(req.query.sortKey && req.query.sortValue){
      sort[req.query.sortKey] = req.query.sortValue
    }else{
      sort.position='desc'
    }

//end sort 
        
    const records= await ProductCategory.find(find)
    .sort(sort)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skip)
    
    res.render('admin/pages/products/index-category', { 
      pageTitle:"Danh mục sản phẩm",
      records:records,
      filterStatus :filterStatus,
      keyword:objectSearch.keyword,
      pagination : objectPagination
     });
  }
 // start one products status
   const  changeStatusCategory = async(req, res)=>{
    
      await ProductCategory.updateOne(
        { _id: req.params.id },
        { status: req.params.status }
      );
      req.flash('success', 'Cập nhật trạng thái thành công!');
      // trở về trang trước đó
      // redirect là chuyển hướng đến một trang khác
      res.redirect("back" );
    }
  //end  start one products status


  // start many products status 
 const  changeManyStatusCategory = async(req, res)=>{
   const ids = req.body.ids.split(","); // Lấy danh sách ID từ request body và loại bỏ khoảng trắng thừa
   const type = req.body.type; // Lấy kiểu trạng thái từ request body
    switch (type) {
      case "active":
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { status: "active" }
        );
        req.flash('success', `cập nhật thành cong cho ${ids.length} sản phẩm!`);
        break;
      case "inactive":
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" }
        );
        req.flash('success', `cập nhật thành cong cho ${ids.length} sản phẩm!`);
        break;
      case "delete-all":
        await ProductCategory.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() } // Cập nhật thời gian xóa
        );
        req.flash('success', `dan xoa ${ids.length} sản phẩm!`);
        break;
      case "update-position":
        for (const item of ids){
          let [id, position] = item.split("-"); // Tách ID và vị trí từ chuỗi
          position = parseInt(position); // Chuyển đổi vị trí thành số nguyên
          await ProductCategory.updateOne(
            { _id: id },
            { position: position }
          );
        }
        req.flash('success', `đã cập nhật vị trí cho ${ids.length} sản phẩm!`);
        break
      default:
        break;
    }
  res.redirect("back");
  }
  //end many products status



// create category 
const createCategoryAdmin=async(req,res)=>{


   let find={
    deleted:false
   }
   function createTree(arr, parentId = "") {
        const tree = [];
        arr.forEach((item) => {
        if (item.parent_id === parentId) {  
        const newItem = item;
        const children = createTree(arr, item.id);
        if (children.length > 0) {
        newItem.children = children;
        }
        tree.push(newItem);
      }
        });
        return tree;
          }

const records = await ProductCategory. find(find);

const newRecords = createTree(records);

   
   res.render('admin/pages/products/createCategory', { 
      pageTitle:"Tao danh muc moi",
      records: newRecords
     });
}

const postcreateCategoryAdmin=async(req,res)=>{
  console.log(req.body);
  if(req.body.position==""){
    const count=await ProductCategory.countDocuments();
    req.body.position=count+1;
  }else{
    req.body.position=parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
   await record.save();

   req.flash('success', `Thêm sản phẩm thành công!`);
   res.redirect(`${systemConfig.prefixAdmin}/products-category`);

}
//end create category 



//start detail category
const detailProductCategory = async (req, res) => {
    const id = req.params.id;
    
    const find = {
      deleted: false,
      _id: id
    };
    const product = await ProductCategory.findOne(find);
   
    //console.log(product);
    res.render('admin/pages/products/detailCategory', {
      pageTitle: "Detail Product Category",
      product: product,
     
    });
  }

//ens detail category


//start delete category 
const deleteCategory = async(req, res)=>{
    const id = req.params.id;
    
    await ProductCategory.updateOne(
      { _id:id },
      { deleted: true },
      { deletedAt: new Date() } // Cập nhật thời gian xóa
    );
    req.flash('success', `DELELTE SUCCESS`);
  
    res.redirect("back");
  }
//end delete category


// start edit category
  // Edit Product
    const editCategory = async (req, res) => {
          try{    
          const id = req.params.id;
          const find = {
            deleted: false,
            _id: id
          };
          const product = await ProductCategory.findOne(find);
          
    
      
        res.render('admin/pages/products/editCategory', {
          pageTitle: "Edit Product",
          product: product
        });
      }catch(err){
        console.log(err);

        res.status(500).send("Server Error");
        res.send("Lỗi không tìm thấy sản phẩm");
      }

      
  }

  const editPathCategory= async (req, res) => {
    const id = req.params.id;
    req.body.title = req.body.title;
    req.body.description = req.body.description;
   
     req.body.position=parseInt(req.body.position);
  
     try{
      await ProductCategory.updateOne({_id:id} , req.body);
      req.flash('success', `Data update success`);
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
     }catch(error){
          console.error('Error updating product:', error);
        req.flash('error', 'Data update fail !');
        return res.redirect(`${systemConfig.prefixAdmin}/products-category`);
     }
  }
// end edit category
  module.exports={productCategoryAdmin , createCategoryAdmin , postcreateCategoryAdmin  , changeStatusCategory , changeManyStatusCategory , detailProductCategory,
    deleteCategory , editCategory, editPathCategory
  }

 