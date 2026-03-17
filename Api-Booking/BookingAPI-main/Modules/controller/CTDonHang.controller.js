const { ObjectId } = require("mongodb");
const DonDatHangmodel = require("../model/CTDonHang.model");
const sachmodel = require("../model/sach.model");

// Get List
exports.getAll = async (req, res) => {
  try {
    const data = await DonDatHangmodel.find();
    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// Get by id (chi tiết đơn hàng)
exports.getbyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await DonDatHangmodel.aggregate([
      { $match: { MaDonHang: ObjectId(id) } },

      {
        $lookup: {
          from: "saches",
          localField: "Masach",
          foreignField: "_id",
          as: "sach",
        },
      },

      {
        $lookup: {
          from: "dondathangs",
          localField: "MaDonHang",
          foreignField: "_id",
          as: "DH",
        },
      },

      { $unwind: "$sach" },
      { $unwind: "$DH" },

      {
        $project: {
          _id: 0,
          id: "$_id",
          MaDonHang: "$MaDonHang",
          Tensach: "$sach.Tensach",
          Anhbia: "$sach.Anhbia",
          Ngaydat: "$DH.Ngaydat",
          Soluong: "$Soluong",
          Dongia: "$Dongia",
        },
      },
    ]);

    console.log(data);
    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Thêm chi tiết đơn hàng
exports.insert = async (req, res) => {
  try {
    const { MaDonHang, Masach, Soluong, Dongia } = req.body;

    if (
      !MaDonHang || typeof MaDonHang !== "string" ||
      !Masach || typeof Masach !== "string" ||
      Soluong == null || typeof Soluong !== "number" ||
      Dongia == null || typeof Dongia !== "number"
    ) {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const dataSach = await sachmodel.findById(Masach);

    const data = new DonDatHangmodel(req.body);
    await data.save();

    const slnton = dataSach.Soluongton - Soluong;

    const slnban = typeof dataSach.soluongban === "number"
      ? dataSach.soluongban + Soluong
      : Soluong;

    await sachmodel.findByIdAndUpdate(Masach, {
      Soluongton: slnton,
      soluongban: slnban,
    });

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Cập nhật chi tiết đơn hàng
exports.update = async (req, res) => {
  try {
    const { id, Soluong, Dongia } = req.body;

    if (
      !id || typeof id !== "string" ||
      Soluong == null || typeof Soluong !== "number" ||
      Dongia == null || typeof Dongia !== "number"
    ) {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await DonDatHangmodel.findByIdAndUpdate(
      id,
      {
        Soluong,
        Dongia,
      },
      { new: true }
    );

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};

// Xóa chi tiết đơn hàng theo MaDonHang
exports.deletebyid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await DonDatHangmodel.deleteMany({
      MaDonHang: ObjectId(id),
    });

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};