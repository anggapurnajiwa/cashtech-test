const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  publicKey: { type: String, unique: true },
  message: String,
  signature: String,  
  isActive: Boolean,  
  lastSignatureTimestamp: Date,
  accessToken: String,
  accessTokenExpired: Date  
}, { timestamps: true });

const User = mongoose.model('Merchant', merchantSchema);

module.exports = User;
