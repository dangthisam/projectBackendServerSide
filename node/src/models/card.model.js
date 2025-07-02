const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema(
  {
    user_id:String,
    products:[
        {
            quantity:Number,
            product_id:String
        }
    ]
  },
  {
    timestamps: true,
    
  }
);


// Tạo model Role từ schema
const Card = mongoose.model('Card', cardSchema, 'cards');

module.exports = Card;