const chudemodel = require("../model/chude.model");
const sachmodel = require("../model/sach.model");


// Get list
exports.getAll = async (req, res) => {
  try {
    const data = await chudemodel.find({ status: false });
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
      return res.send({ Messager: "Id Sai Định Dạng Hoặc Null" });
    }

    const data = await chudemodel.findById(id);
    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};


// Get by name
exports.getbyname = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name || typeof name !== "string") {
      return res.send({ Messager: "name Sai Định Dạng Hoặc Null" });
    }

    const data = await chudemodel.find({
      $text: { $search: `"${name}"` },
      status: false,
    });

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};


// Insert
exports.insert = async (req, res) => {
  try {
    const { TenChuDe } = req.body;

    if (!TenChuDe || typeof TenChuDe !== "string") {
      return res.send({ Messager: "TenChuDe Sai Định Dạng Hoặc Null" });
    }

    const check = await chudemodel.find({
      $text: { $search: `"${TenChuDe}"` },
    });

    if (check.length > 0) {
      return res.send({ Messager: "Không Thể Thêm Chủ Đề Đã Có" });
    }

    const datachude = new chudemodel(req.body);
    await datachude.save();

    res.send(datachude);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};


// Update
exports.update = async (req, res) => {
  try {
    const { id, TenChuDe } = req.body;

    if (!id || !TenChuDe || typeof TenChuDe !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await chudemodel.findByIdAndUpdate(
      id,
      { TenChuDe: TenChuDe },
      { new: true }
    );

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};


// Delete
exports.deletebyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    await sachmodel.updateMany(
      { MaCD: id },
      { status: true }
    );

    await chudemodel.findByIdAndUpdate(
      id,
      { status: true }
    );

    res.send({ Messager: "Xóa Thành Công" });

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};