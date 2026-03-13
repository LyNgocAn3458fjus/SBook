const mongoose = require("mongoose");

// Định nghĩa Schema cho mô hình voucher
const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true, // Đảm bảo mã voucher là duy nhất
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  minOrderAmount: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
});

// Tạo mô hình Voucher từ Schema
const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
