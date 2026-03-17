const Voucher = require("../model/voucher.model");

// Lấy tất cả voucher
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch {
    res.status(500).json({ error: "Failed to get vouchers" });
  }
};

// Thêm voucher
exports.addVoucher = async (req, res) => {
  try {
    const {
      code,
      expirationDate,
      quantity,
      minOrderAmount,
      discountPercentage,
    } = req.body;

    const voucher = new Voucher({
      code,
      expirationDate,
      quantity,
      minOrderAmount,
      discountPercentage,
    });

    await voucher.save();

    res.status(201).json(voucher);
  } catch {
    res.status(500).json({ error: "Failed to add voucher" });
  }
};

// Cập nhật voucher
exports.updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    res.json(voucher);
  } catch {
    res.status(500).json({ error: "Failed to update voucher" });
  }
};

// Xóa voucher
exports.deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findByIdAndDelete(id);

    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    res.json({ message: "Voucher deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete voucher" });
  }
};

// Lấy voucher theo ID
exports.getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findById(id);

    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    res.json(voucher);
  } catch {
    res.status(500).json({ error: "Failed to get voucher" });
  }
};

// Lấy voucher theo CODE
exports.getVoucherByCode = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findOne({ code: id });

    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    res.json(voucher);
  } catch {
    res.status(500).json({ error: "Failed to get voucher" });
  }
};

// Áp dụng voucher
exports.applyVoucher = async (req, res) => {
  try {
    const { voucherCode, orderTotal } = req.body;

    const voucher = await Voucher.findOne({ code: voucherCode });

    if (!voucher) {
      return res.status(404).json({ error: "Voucher not found" });
    }

    if (voucher.expirationDate < new Date()) {
      return res.status(400).json({ error: "Voucher has expired" });
    }

    if (orderTotal < voucher.minOrderAmount) {
      return res.status(400).json({
        error: "Order total does not meet voucher's minimum amount requirement",
      });
    }

    if (voucher.quantity <= 0) {
      return res.status(400).json({ error: "Voucher has no quantity left" });
    }

    const discountAmount = (orderTotal * voucher.discountPercentage) / 100;

    voucher.quantity -= 1;
    await voucher.save();

    res.json({
      voucher,
      discountAmount,
    });
  } catch {
    res.status(500).json({ error: "Failed to apply voucher" });
  }
};