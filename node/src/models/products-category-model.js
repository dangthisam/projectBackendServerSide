// models/product.js
const slug = require('mongoose-slug-updater');
const mongoose = require('mongoose');
mongoose.plugin(slug);


// Định nghĩa schema cho Product
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: { type: String },
   
    slug: { type: String, slug: "title", unique: true, slug_padding_size: 4 },
    
   
   parent_id:{
    type:String,
    default:""
   },
    thumbnail: { type: String },
    status: {type: String},
    deleted:{
      type: Boolean,
      default: false,
    },
    position: { type: Number },
    deletedAt: { type: Date },
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Thêm index để cải thiện hiệu suất tìm kiếm
productSchema.index({ title: 1, brand: 1 });

// Virtual field để tính giá sau giảm giá
productSchema.virtual('priceNewCalculated').get(function () {
  return this.price * (1 - this.discountPercentage / 100);
});

// Tạo model Product từ schema
const ProductCategory = mongoose.model('Product-Category', productSchema);

module.exports = ProductCategory;