const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema(
  {
    title: { type: String},
    description: { type: String },
 permissions: { type: Array, default: [] }, // Mảng chứa các quyền hạn của role
    deleted:{
      type: Boolean,
      default: false,
    },

    deletedAt: { type: Date },
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Tạo model Role từ schema
const Role = mongoose.model('Role', roleSchema, 'roles');

module.exports = Role;