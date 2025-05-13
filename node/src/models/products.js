// models/product.js
const slug = require('mongoose-slug-updater');
const mongoose = require('mongoose');
mongoose.plugin(slug);


// Định nghĩa schema cho Product
const productSchema = new mongoose.Schema(
  {
    title: { type: String},
    description: { type: String },
    price: { type: Number },
    slug: { type: String, slug: "title", unique: true, slug_padding_size: 4 },
    stock: { type: Number},
    discountPercentage: { type: Number },
   
    thumbnail: { type: String },
    status: {type: String},
    deleted:{
      type: Boolean,
      default: false,
    },
    position: { type: Number },
    deletedAt: { type: Date },
    sku: { type: String, unique: false },
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
const Product = mongoose.model('Product', productSchema);

module.exports = Product;