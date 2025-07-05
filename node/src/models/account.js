const mongoose = require('mongoose');
const generate=require("../helps/generate");
const { generateRandomString } = require('../helps/generate');

const accountSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        token: { type: String, default: generateRandomString(20) },
        phone: String,
        avatar: { type: String, default: null },

        role_id: String,
        status: String, // 'active', 'inactive', 'banned'
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



module.exports = mongoose.model('Account', accountSchema);
