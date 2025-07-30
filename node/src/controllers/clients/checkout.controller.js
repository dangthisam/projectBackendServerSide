
const Cart=require("../../models/card.model")
const Order=require("../../models/order.model")
const Product=require("../../models/products")
const productHelp=require("../../helps/products")
const dotenv = require('dotenv');
dotenv.config();
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');   
const checkoutProducts=async (req, res)=>{
   const cartId=req.cookies.cardId;
     const cart=await Cart.findById(cartId);
   if(cart.products.length>0){

     for (const item of cart.products) {
        productsId=item.product_id;
        const productInfo=await Product.findOne({
            _id:productsId,
            deleted:false,
            status:"active"
        }).select("title thumbnail price slug discountPercentage")
      
        productInfo.priceNew=productHelp.priceNew(productInfo)
          item.productInfo=productInfo;
          item.totalPrice=item.productInfo.priceNew*item.quantity
          

   }
}


cart.totalPrice=cart.products.reduce((sum, item) =>  sum+item.productInfo.priceNew*item.quantity, 0)

    
   
    res.render("clients/pages/checkout/index",{
     title:"Thông tin đơn hàng",
     cartDetail:cart
    }
    )
}


const checkProductDetail = async (req, res) => {
    const cartId = req.cookies.cardId;
   const userInfo=req.body;
   const cart=await Cart.findById(cartId);
const products=[];
for (const product of cart.products){
    const objectProduct={
        product_id:product.product_id,
        quantity:product.quantity,
        price:0,
        discountPercentage:0
    
    }
    const productInfo=await Product.findOne({
        _id:product.product_id,
        deleted:false,
        status:"active"
    }).select("price discountPercentage")

    objectProduct.price=productInfo.price;
    objectProduct.discountPercentage=productInfo.discountPercentage;
    products.push(objectProduct)
}

const orderInfo={
    cart_id:cartId,
    userInfo:userInfo,
    products:products,
    
}
const  order=new Order(orderInfo);
await order.save();


await Cart.updateOne({
    _id:cartId
},{
    $set:{
        products:[],
        totalPrice:0
    }   
})


res.redirect(`/checkout/success/${order.id}`)
}
 

const successOrder=async (req, res)=>{
    const orderId=req.params.id;
    const order=await Order.findById(orderId);


    for (const product of order.products) {
        const productInfo=await Product.findOne({
            _id:product.product_id,
            
        }).select("title thumbnail price slug discountPercentage")
      

        productInfo.priceNew=productHelp.priceNew(productInfo)
          product.productInfo=productInfo;
          product.totalPrice=product.productInfo.priceNew*product.quantity

    
}   
order.totalPrice=order.products.reduce((sum, item) =>  sum+item.productInfo.priceNew*item.quantity, 0)
res.render("clients/pages/checkout/success",{
        title:"Thông tin đơn hàng",
        order:order
    })
}

const paymentOrder=async(req,res)=>{
    const vnpay = new VNPay({
        tmnCode: "FQ1FXS2P",
        secureSecret: 'FSLKKXGZ8WGH7ZPOAQJM1EI8B7O6OSOJ',
        vnpayHost: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
        testMode: true,
        hashAlgorithm: 'SHA512',
        loggerFn: ignoreLogger
    });

   const vnpayResponse = await vnpay.buildPaymentUrl({
  vnp_Amount: 1000000, // Kiểm tra SDK nhân 100 hay chưa
  vnp_TxnRef:'123456',
  vnp_OrderInfo: 'Thanh toán đơn hàng',
  vnp_OrderType: 'other',
  vnp_CreateDate: dateFormat(new Date(), 'yyyyMMddHHmmss'),
  vnp_CurrCode: 'VND',
  vnp_IpAddr: '127.0.0.1',
  vnp_ReturnUrl: 'http://localhost:3000/checkout/success',
  vnp_Locale: VnpLocale.VN, // hoặc VnpLocale.VN nếu đã import đúng
  vnp_OrderInfo: 'Thanh toán đơn hàng',
  vnp_ExpireDate: dateFormat(new Date(Date.now() + 15 * 60 * 1000), 'yyyyMMddHHmmss'),
  vnp_OrderType: 'other' // nếu cần
});
res.redirect(vnpayResponse);
}
module.exports={checkoutProducts, checkProductDetail  , successOrder, paymentOrder}