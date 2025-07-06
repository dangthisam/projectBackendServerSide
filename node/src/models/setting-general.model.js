// models/Setting.js
const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  siteName:        { type: String, default: '' },
  
  logo   :    { type: String, default: '' },

  email:    { type: String, default: '' },
  hotline:         { type: String, default: '' },
  address:         { type: String, default: '' },
  copyright:{ type: String, default: '' },
  instagram:       { type: String, default: ''},
  facebook:        { type: String, default: '' },

}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
