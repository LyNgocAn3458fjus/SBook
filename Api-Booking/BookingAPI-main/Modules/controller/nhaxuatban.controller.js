const nhaxuatban = require("../model/nhaxuatban.model");
const sachmodel = require("../model/sach.model");

// Get List
exports.getAll = async (req, res) => {
  try {
    const data = await nhaxuatban.find({ status: false });
    res.send(data);
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Get by ID
exports.getbyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await nhaxuatban.findById(id);
    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Thêm mới
exports.insert = async (req, res) => {
  try {
    const { TenNXB } = req.body;

    if (!TenNXB || typeof TenNXB !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = new nhaxuatban(req.body);
    await data.save();

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Cập nhật
exports.update = async (req, res) => {
  try {
    const { id, TenNXB, Diachi, DienThoai } = req.body;

    if (
      !id || typeof id !== "string" ||
      !TenNXB || typeof TenNXB !== "string" ||
      !Diachi || typeof Diachi !== "string" ||
      !DienThoai || typeof DienThoai !== "string"
    ) {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await nhaxuatban.findByIdAndUpdate(
      id,
      {
        TenNXB,
        Diachi,
        DienThoai
      },
      { new: true }
    );

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Xóa theo ID
exports.deletebyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    // soft delete NXB
    await nhaxuatban.findByIdAndUpdate(id, { status: true });

    // soft delete sách thuộc NXB
    await sachmodel.updateMany(
      { MaNXB: id },
      { status: true }
    );

    res.send({ Messager: "Xóa Thành Công" });

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};