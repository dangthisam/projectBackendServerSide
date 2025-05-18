
const Product =require("../../models/products");
const filter =require("../../helps/filterStatus");
const search =require("../../helps/search");
const pagination=require("../../helps/pagination");
const systemConfig = require("../../config/system");


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
    const products = await Product.find(find)
    // sort là sắp xếp theo thứ tự giảm dần

    .sort(sort)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skip);
    
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
  
    await Product.updateOne(
      { _id: req.params.id },
      { status: req.params.status }
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
   const type = req.body.type; // Lấy kiểu trạng thái từ request body
    switch (type) {
      case "active":
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: "active" }
        );
        req.flash('success', `cập nhật thành cong cho ${ids.length} sản phẩm!`);
        break;
      case "inactive":
        await Product.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" }
        );
        req.flash('success', `cập nhật thành cong cho ${ids.length} sản phẩm!`);
        break;
      case "delete-all":
        await Product.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt: new Date() } // Cập nhật thời gian xóa
        );
        req.flash('success', `dan xoa ${ids.length} sản phẩm!`);
        break;
      case "update-position":
        for (const item of ids){
          let [id, position] = item.split("-"); // Tách ID và vị trí từ chuỗi
          position = parseInt(position); // Chuyển đổi vị trí thành số nguyên
          await Product.updateOne(
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
  const deleteProduct = async(req, res)=>{
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });
    // res.redirect("back");
    await Product.updateOne(
      { _id:id },
      { deleted: true },
      { deletedAt: new Date() } // Cập nhật thời gian xóa
    );
    req.flash('success', `da xoa thành cong san pham`);
    // trở về trang trước đó
    // redirect là chuyển hướng đến một trang khác
    res.redirect("back" );
  }

  // const createProduct = async(req, res)=>{
    const createProduct = async (req, res) => {
      res.render('admin/pages/products/create');
      //res.send("Create Product");
    }
    const createPost = async (req, res) => {
      // validate.validateCreateProduct(req, res); // Gọi hàm validate để kiểm tra dữ liệu đầu vào
      // nếu có lỗi thì trả về trang trước đó và hiển thị thông báo lỗi
      // if (req.validationErrors()) {      
      req.body.price=parseInt(req.body.price);
      //req.body.stock=parseInt(req.body.stock);
      req.body.discountPercentage=parseInt(req.body.discountPercentage);
    //  req.body.position=parseInt(req.body.position);
      if(req.body.position==-2){
        const count = await Product.countDocuments();
      
        req.body.position = count + 1; // Tự động gán vị trí nếu không có giá trị
      }
    // tạo chuyến bay mới từ dữ liệu trong req.body
      const product = new Product(req.body);
   
      //kết nối csdl mongodb và lưu sản phẩm vào csdl
      
      await product.save();

      // hiẹn thị thông báo thành công
      req.flash('success', `Thêm sản phẩm thành công!`);
     // res.locals.messages = req.flash(); // Lưu thông báo vào biến cục bộ
      // setTimeout(() => {
      //   res.redirect(`${systemConfig.prefixAdmin}/products`); // Chuyển hướng đến trang danh sách sản phẩm
      // }, 2000); // Chờ 2 giây trước khi chuyển hướng
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
          const product = await Product.findOne(find);
          
    
      
        res.render('admin/pages/products/edit', {
          pageTitle: "Edit Product",
          product: product
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


  // const editProduct = async (req, res) => {
  //   const id = req.params.id;
  const editPathProducts= async (req, res) => {
    const id = req.params.id;
    req.body.title = req.body.title;
    req.body.description = req.body.description;

    req.body.price=parseInt(req.body.price);
    //req.body.stock=parseInt(req.body.stock);
    req.body.discountPercentage=parseInt(req.body.discountPercentage);
     req.body.position=parseInt(req.body.position);
     if(req.file){
      req.body.thumbnail=`/upload/${req.file.filename}`;
     }

     try{
      await Product.updateOne({_id:id} , req.body);
      req.flash('success', `Sua sản phẩm thành công!`);
        res.redirect(`${systemConfig.prefixAdmin}/products`);
     }catch(error){
          console.error('Error updating product:', error);
        req.flash('error', 'Sửa sản phẩm thất bại!');
        return res.redirect(`${systemConfig.prefixAdmin}/products`);
     }
  }

module.exports={productAdmin , changestatusMulti , changestatus, deleteProduct , createProduct , createPost , editProduct , editPathProducts , detailProduct};