const express = require('express');
const router = express.Router();
const {productEdit, homeProducts , getAllProducts}=require("../../controllers/clients/productsController");
// Route con cho /products
// router.get('/', (req, res) => {
//   res.render('clients/pages/products/index'); // Render trang danh sách sản phẩm
// });
router.get('/', homeProducts);
router.get('/edit', productEdit);

router.post('/edit', (req, res) => {
  // Logic xử lý chỉnh sửa sản phẩm (ví dụ: lưu vào MongoDB)
  res.send('Sản phẩm đã được chỉnh sửa');
});

router.get('/delete', (req, res) => {
  res.render('clients/pages/products/delete'); // Render trang xóa sản phẩm
});

router.post('/delete', (req, res) => {
  // Logic xóa sản phẩm
  res.send('Sản phẩm đã bị xóa');
});
  router.get("/getAllproducts" , getAllProducts);
module.exports = router;