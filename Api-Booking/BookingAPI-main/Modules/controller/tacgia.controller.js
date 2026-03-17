const tacgiamodel = require("../model/tacgia.model");
const sachmodel = require("../model/sach.model");

// Get List
exports.getAll = async (req, res) => {
  try {
    const data = await tacgiamodel.find({ status: false });
    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// Get by id
exports.getbyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await tacgiamodel.findById(id);
    res.send(data);
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Thêm Mới
exports.insert = async (req, res) => {
  try {
    const { TenTG } = req.body;

    if (!TenTG || typeof TenTG !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = new tacgiamodel(req.body);
    await data.save();

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Cập Nhật
exports.update = async (req, res) => {
  try {
    const { id, TenTG, Diachi, Tieusu, Dienthoai } = req.body;

    if (
      !id ||
      typeof id !== "string" ||
      !TenTG ||
      typeof TenTG !== "string" ||
      !Diachi ||
      typeof Diachi !== "string" ||
      !Tieusu ||
      typeof Tieusu !== "string" ||
      !Dienthoai ||
      typeof Dienthoai !== "string"
    ) {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await tacgiamodel.findByIdAndUpdate(
      id,
      {
        TenTG,
        Diachi,
        Tieusu,
        Dienthoai,
      },
      { new: true }
    );

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Xóa theo id
exports.deletebyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    // Soft delete sách của tác giả
    await sachmodel.updateMany(
      { MaTacGia: id },
      { status: true }
    );

    // Soft delete tác giả
    await tacgiamodel.findByIdAndUpdate(
      id,
      { status: true }
    );

    res.send({ Messager: "Xóa Thành Công" });
  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};