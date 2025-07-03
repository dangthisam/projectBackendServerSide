const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    //user_id:String,
    cart_id:String,
    products:[
        {
            quantity:Number,
            product_id:String,
            price:Number,
            discountPercentage:Number
        }
    ],
    userInfo:{
        fullName:String,
        phone:String,
        address:String
    },
    deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:Date
  },
  {
    timestamps: true,
    
  }
);


// Tạo model Role từ schema
const Order= mongoose.model('Order', orderSchema, 'orders');


module.exports = Order;