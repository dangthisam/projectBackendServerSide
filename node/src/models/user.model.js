const mongoose = require('mongoose');
const generate=require("../helps/generate");
const { generateRandomString } = require('../helps/generate');

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        tokenUser: { type: String, default: generateRandomString(20) },
        phone: String,
        avatar: { type: String, default: null },
        status: {
            type:String,
            default:'active'
        }, // 'active', 'inactive', 'banned'
        deleted: {
        type: Boolean,
        default: false,
        },
        deletedAt: { type: Date },
    },
    {
        timestamps: true,
       
    }
  
);



module.exports = mongoose.model('User', userSchema);
