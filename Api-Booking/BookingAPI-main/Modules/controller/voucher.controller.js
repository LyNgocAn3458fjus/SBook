const Voucher = require("../model/voucher.model");

// API Lấy danh sách tất cả các voucher
exports.getAllVouchers = async (req, res) => {
    try {
      const vouchers = await Voucher.find();
      res.json(vouchers);
    } catch (error) {
      res.status(500).json({ error: "Failed to get vouchers" });
    }
  };

// API Thêm voucher
exports.addVoucher = async (req, res) => {
  try {
    const { code, expirationDate, quantity, minOrderAmount, discountPercentage } = req.body;
    const newVoucher = new Voucher({
      code,
      expirationDate,
      quantity,
      minOrderAmount,
      discountPercentage,
    });

    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    res.status(500).json({ error: "Failed to add voucher" });
  }
};

// API Sửa thông tin voucher theo ID
exports.updateVoucher = async (req, res) => {
  try {
    const voucherId = req.params.id;
    const { code, expirationDate, quantity, minOrderAmount, discountPercentage } = req.body;

    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    voucher.code = code;
    voucher.expirationDate = expirationDate;
    voucher.quantity = quantity;
    voucher.minOrderAmount = minOrderAmount;
    voucher.discountPercentage = discountPercentage;

    await voucher.save();
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ error: "Failed to update voucher" });
  }
};

// API Xóa voucher theo ID
exports.deleteVoucher = async (req, res) => {
  try {
    const voucherId = req.params.id;
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    await voucher.remove();
    res.json({ message: "Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete voucher" });
  }
};

// API Lấy thông tin voucher theo ID
exports.getVoucherById = async (req, res) => {
  try {
    const voucherId = req.params.id;
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    res.json(voucher);
  } catch (error) {
    res.status(500).json({ error: "Failed to get voucher" });
  }
};

exports.getVoucherByCode = async (req, res) => {
    try {
      const id = req.params.id;
      const voucher = await Voucher.findOne({ code: id });
  
      if (!voucher) {
        return res.status(404).json({ error: "Voucher not found" });
      }
  
      res.json(voucher);
    } catch (error) {
      res.status(500).json({ error: "Failed to get voucher" });
    }
};

// API Áp dụng voucher cho một đơn hàng cụ thể
exports.applyVoucher = async (req, res) => {
    try {
      const { voucherCode } = req.body;
      const orderTotal = req.body.orderTotal; // Tổng số tiền của đơn hàng
      const voucher = await Voucher.findOne({ code: voucherCode });
  
      if (!voucher) {
        return res.status(404).json({ error: "Voucher not found" });
      }
  
      if (voucher.expirationDate < new Date()) {
        return res.status(400).json({ error: "Voucher has expired" });
      }
  
      if (orderTotal < voucher.minOrderAmount) {
        return res.status(400).json({ error: "Order total does not meet voucher's minimum amount requirement" });
      }
  
      if (voucher.quantity <= 0) {
        return res.status(400).json({ error: "Voucher has no quantity left" });
      }
  
      // Tính số tiền giảm dựa vào phần trăm giảm giá
      const discountAmount = (orderTotal * voucher.discountPercentage) / 100;
  
      // Giảm số lượng voucher còn lại và lưu vào cơ sở dữ liệu
      voucher.quantity--;
      await voucher.save();
  
      // Trả về thông tin voucher đã áp dụng và số tiền giảm
      res.json({ voucher, discountAmount });
    } catch (error) {
      res.status(500).json({ error: "Failed to apply voucher" });
    }
  };