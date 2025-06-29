
const Product =require("../../models/products");
const filter =require("../../helps/filterStatus");
const search =require("../../helps/search");
const pagination=require("../../helps/pagination");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/products-category-model");
const Account = require("../../models/account");
// in ra giao dien 
const productAdmin= async (req,res)=>{
 // lọc theo trang thái hoạt động hay không hoạt động
     

 //Đoạn Lọc
    filterStatus =filter(req.query.status);
    let find = {
      deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    // tìm kiếm khi người dùng nhập vào ô input
    const objectSearch =search(req.query);

    if(objectSearch.regex){
      find.title=objectSearch.regex;
    }
      const countProducts = await Product.countDocuments(find);
    let objectPagination = pagination(
      {
        currentPage:1,
        limitPage:4
      },
      req.query,
      countProducts
    )

    //end pagination

    

    sort={};
    if(req.query.sortKey && req.query.sortValue){
      sort[req.query.sortKey] = req.query.sortValue
    }else{
      sort.position='desc'
    }

    const accounts = await Account.find({ _id: res.locals.user.id,deleted: false });
    const products = await Product.find(find)
    // sort là sắp xếp theo thứ tự giảm dần

    .sort(sort)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skip);
  

  for (const product of products) {
    // lấy ra người tạo sản phẩm
    const user = await Account.findOne({ _id: product.createdBy.accountID, deleted: false });
    if (user) {
      product.createdByName = user.username;
    } else {
      product.createdByName = 'N/A'; // Nếu không tìm thấy người dùng, gán giá trị mặc định
    }

    // lấy ra người cập nhật gần nhất 
    const lastUpdate = product.updateBy.length > 0 ? product.updateBy[product.updateBy.length - 1] : null;
    
    // tìm ra người update cuối cùng
    if (lastUpdate) {
      const userUpdate = await Account.findOne({ _id: lastUpdate.accountID, deleted: false });
      if (userUpdate) {
        product.lastUpdateName = userUpdate.username;
      }
  }
  }
    
    res.render('admin/pages/products/index', { 

      // chuyền ra ngoài giao diện 
        products :products,
        filterStatus :filterStatus,
        keyword : objectSearch.keyword,
        pagination : objectPagination
     });
  }
     //thay dổi trạng thái sản phẩm
  // nhận id sản phẩm và kiểu trạng thái từ request params
  const  changestatus = async(req, res)=>{
    const updateBy ={
         accountID: res.locals.user.id,
         updatedAt: new Date()

       }
    await Product.updateOne(
      { _id: req.params.id },
      { status: req.params.status ,
        $push:{
          updateBy:updateBy
        }

      }
    );
    req.flash('success', 'Cập nhật trạng thái thành công!');
    // trở về trang trước đó
    // redirect là chuyển hướng đến một trang khác
    res.redirect("back" );
  }
   // thay đổi trạng thái nhiều sản phẩm cùng lúc
   // nhận danh sách id từ request body và kiểu trạng thái
  const  changestatusMulti = async(req, res)=>{
   const ids = req.body.ids.split(","); // Lấy danh sách ID từ request body và loại bỏ khoảng trắng thừa
   const type = req.body.type;
    const updateBy ={
         accountID: res.locals.user.id,
         updatedAt: new Date()

       } // Lấy kiểu trạng thái từ request body
    switch (type) {
    
      case "active":
         
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: "active",$push:{
              updateBy:updateBy
            } },
          
        );
        req.flash('success', `cập nhật thành cong cho ${ids.length} sản phẩm!`);
        break;
      case "inactive":
         
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" ,
            $push:{
              updateBy:updateBy
            },
          
          }
        );
        req.flash('success', `cập nhật thành cong cho ${ids.length} sản phẩm!`);
        break;
      case "delete-all":
        await Product.updateMany(
          { _id: { $in: ids } },
          { deleted: true, 
            deletedBy: {
              accountID: res.locals.user.id, // Lấy ID người dùng từ session
              deletedAt: new Date() // Cập nhật thời gian xóa
            }
          } // Cập nhật thời gian xóa
        );
        req.flash('success', `dan xoa ${ids.length} sản phẩm!`);
        break;
      case "update-position":
        for (const item of ids){
          let [id, position] = item.split("-"); // Tách ID và vị trí từ chuỗi
          position = parseInt(position); // Chuyển đổi vị trí thành số nguyên
          await Product.updateOne(
            { _id: id },
            { position: position ,
              $push:{
                updateBy:updateBy
              }
            },
           
          );
        }
        req.flash('success', `đã cập nhật vị trí cho ${ids.length} sản phẩm!`);
        break
      default:
        break;
    }
  res.redirect("back");
  }
   
  //delete products
  const deleteProduct = async(req, res)=>{
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });
    // res.redirect("back");
    await Product.updateOne(
      { _id:id },
      {
        deleted: true,
        deletedBy: {
          accountID: res.locals.user.id, // Lấy ID người dùng từ session
          deletedAt: new Date() // Cập nhật thời gian xóa
       } },
 
    );
    req.flash('success', `da xoa thành cong san pham`);
    // trở về trang trước đó
    // redirect là chuyển hướng đến một trang khác
    res.redirect("back" );
  }

  // const createProduct = async(req, res)=>{
    const createProduct = async (req, res) => {
      // Lấy danh sách danh mục sản phẩm từ cơ sở dữ liệu
      const find={
        deleted: false
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
      
      const categories = await ProductCategory.find(find);

      

      const categoryTree = createTree(categories);
      res.render('admin/pages/products/create', {
        category: categoryTree
      });
      //res.send("Create Product");
    }

    // Xử lý khi người dùng gửi form tạo sản phẩm
    const createPost = async (req, res) => {
      req.body.price=parseInt(req.body.price);
    
      req.body.discountPercentage=parseInt(req.body.discountPercentage);
    //  req.body.position=parseInt(req.body.position);
      if(req.body.position==-2){
        const count = await Product.countDocuments();
      
        req.body.position = count + 1; // Tự động gán vị trí nếu không có giá trị
      }
   

       req.body.createdBy = {
         accountID: res.locals.user.id, // Lấy ID người dùng từ session
      
       };


      const product = new Product(req.body);
   
  
      
      await product.save();

      // hiẹn thị thông báo thành công
      req.flash('success', `Thêm sản phẩm thành công!`);
      res.redirect(`${systemConfig.prefixAdmin}/products`); // Chuyển hướng đến trang danh sách sản phẩm
    }


    // Edit Product
    const editProduct = async (req, res) => {
          try{    
          const id = req.params.id;
          const find = {
            deleted: false,
            _id: id
          };

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
          const product = await Product.findOne(find);
          const categories = await ProductCategory.find({ deleted: false });
          const categoryTree = createTree(categories);
        res.render('admin/pages/products/edit', {
          pageTitle: "Edit Product",
          product: product,
          category: categoryTree
        });
      }catch(err){
        console.log(err);

        res.status(500).send("Server Error");
        res.send("Lỗi không tìm thấy sản phẩm");
      }

      
  }


  // detail product
  const detailProduct = async (req, res) => {
    const id = req.params.id;
    
    const find = {
      deleted: false,
      _id: id
    };
    const product = await Product.findOne(find);
   
    //console.log(product);
    res.render('admin/pages/products/detail', {
      pageTitle: "Detail Product",
      product: product,
     
    });
  }


  const editPathProducts= async (req, res) => {
    const id = req.params.id;
    req.body.title = req.body.title;
    req.body.description = req.body.description;

    req.body.price=parseInt(req.body.price);
    //req.body.stock=parseInt(req.body.stock);
    req.body.discountPercentage=parseInt(req.body.discountPercentage);
     req.body.position=parseInt(req.body.position);
    

     try{

       const updateBy ={
         accountID: res.locals.user.id,
         updatedAt: new Date()

       }

      
      await Product.updateOne({_id:id} , {
        // lưu nhiều log lịch sử update
        ...req.body,
        $push:{
          updateBy:updateBy
        }
      });
      req.flash('success', `Data update success`);
        res.redirect(`${systemConfig.prefixAdmin}/products`);
     }catch(error){
          console.error('Error updating product:', error);
        req.flash('error', 'Data update fail !');
        return res.redirect(`${systemConfig.prefixAdmin}/products`);
     }
  }

module.exports={productAdmin , changestatusMulti , changestatus, deleteProduct , createProduct , createPost , editProduct , editPathProducts , detailProduct};