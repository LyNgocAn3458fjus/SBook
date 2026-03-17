const { ObjectId } = require("mongodb");
const DonDatHangmodel = require("../model/DonHang.model");
const sachmodel = require("../model/sach.model");

// ======================
// Get List
// ======================
exports.getAll = async (req, res) => {
  try {
    const data = await DonDatHangmodel.aggregate([
      { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
      {
        $lookup: {
          from: "khachhangs",
          localField: "MaKH",
          foreignField: "_id",
          as: "KH",
        },
      },
      { $unwind: "$KH" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          HoTen: "$KH.HoTen",
          TongTien: 1,
          Ngaydat: 1,
          Tinhtranggiaohang: 1,
        },
      },
    ]);

    if (!data.length) return res.status(404).send("Not Found");

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Pagination
// ======================
exports.getAllPagination = async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);

    const data = await DonDatHangmodel.aggregate([
      { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
      {
        $lookup: {
          from: "khachhangs",
          localField: "MaKH",
          foreignField: "_id",
          as: "KH",
        },
      },
      { $unwind: "$KH" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          HoTen: "$KH.HoTen",
          TongTien: 1,
          Tinhtranggiaohang: 1,
          Ngaydat: 1,
        },
      },
    ])
      .skip((page - 1) * limit)
      .limit(limit);

    if (!data.length) return res.status(404).send("Not Found");

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Pagination by Date
// ======================
exports.PhanTrangDonHang = async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);

    const count = await DonDatHangmodel.countDocuments({
      MaKH: req.params.idKH,
      Ngaydat: {
        $gte: new Date(req.params.Ngaydat),
        $lte: new Date(req.params.GioiHan),
      },
    });

    if (!count)
      return res.send({
        Messager: "Hiện Chưa Có Đơn Hàng Trong Khoảng Thời Gian Này",
      });

    const data = await DonDatHangmodel.aggregate([
      { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
      {
        $match: {
          Ngaydat: {
            $gte: new Date(req.params.Ngaydat),
            $lte: new Date(req.params.GioiHan),
          },
        },
      },
      { $match: { MaKH: ObjectId(req.params.idKH) } },
      {
        $lookup: {
          from: "khachhangs",
          localField: "MaKH",
          foreignField: "_id",
          as: "KH",
        },
      },
      { $unwind: "$KH" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          HoTen: "$KH.HoTen",
          TongTien: 1,
          Tinhtranggiaohang: 1,
          Ngaydat: 1,
        },
      },
    ])
      .skip((page - 1) * limit)
      .limit(limit);

    res.send({ data, count });
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Get by ID
// ======================
exports.getbyid = async (req, res) => {
  try {
    const data = await DonDatHangmodel.aggregate([
      { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "khachhangs",
          localField: "MaKH",
          foreignField: "_id",
          as: "KH",
        },
      },
      { $unwind: "$KH" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          HoTen: "$KH.HoTen",
          Ngaydat: 1,
          Ngaygiao: 1,
          Tinhtranggiaohang: 1,
          TongTien: 1,
        },
      },
    ]);

    if (!data.length) return res.status(404).send("Not Found");

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Get by idKH
// ======================
exports.getbyidKH = async (req, res) => {
  try {
    const data = await DonDatHangmodel.find({ MaKH: req.params.idKH });

    if (!data.length) return res.status(404).send("Not Found");

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Get by idKH Pagination
// ======================
exports.getbyidKHPhanTrang = async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);

    const count = await DonDatHangmodel.countDocuments({
      MaKH: req.params.idKH,
    });

    if (!count)
      return res.send({ Messager: "Hiện Bạn Chưa Có Đơn Hàng Nào" });

    const data = await DonDatHangmodel.find({ MaKH: req.params.idKH })
      .skip((page - 1) * limit)
      .limit(limit);

    res.send({ data, count });
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Get by idKH Date
// ======================
exports.getbyidKHDate = async (req, res) => {
  try {
    const data = await DonDatHangmodel.find({
      MaKH: req.params.idKH,
      Ngaydat: {
        $gte: new Date(req.params.Ngaydat),
        $lte: new Date(req.params.GioiHan),
      },
    });

    if (!data.length) return res.status(404).send("Not Found");

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Pagination with count
// ======================
exports.getAllPaginationHaveCount = async (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);

    const count = await DonDatHangmodel.countDocuments();

    if (!count) return res.send({ Messager: "Không Có Sách Này" });

    const data = await DonDatHangmodel.aggregate([
      { $addFields: { MaKH: { $toObjectId: "$MaKH" } } },
      {
        $lookup: {
          from: "khachhangs",
          localField: "MaKH",
          foreignField: "_id",
          as: "KH",
        },
      },
      { $unwind: "$KH" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          HoTen: "$KH.HoTen",
          TongTien: 1,
          Tinhtranggiaohang: 1,
          Ngaydat: 1,
        },
      },
    ])
      .skip((page - 1) * limit)
      .limit(limit);

    res.send({ data, count });
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Insert
// ======================
exports.insert = async (req, res) => {
  try {
    let mess = [];

    for (let i = 0; i < req.body.MasachCheck.length; i++) {
      let data_check = await sachmodel.findById(req.body.MasachCheck[i]);

      if (data_check.Soluongton < req.body.SoluongCheck[i]) {
        mess.push(
          `Hiện Sách ${data_check.Tensach} Chỉ Còn: ${data_check.Soluongton}`
        );
      }
    }

    if (mess.length) return res.send({ Messager: mess });

    const data = new DonDatHangmodel(req.body);
    await data.save();

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Update
// ======================
exports.update = async (req, res) => {
  try {
    const data = await DonDatHangmodel.findByIdAndUpdate(
      req.body.id,
      {
        Dathanhtoan: req.body.Tinhtranggiaohang,
        Tinhtranggiaohang: req.body.Tinhtranggiaohang,
        Ngaygiao: new Date(),
      },
      { new: true }
    );

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};

// ======================
// Delete
// ======================
exports.deletebyid = async (req, res) => {
  try {
    const data = await DonDatHangmodel.findByIdAndDelete(req.params.id);

    res.send(data);
  } catch (error) {
    res.send({ Messager: "API Lỗi" });
  }
};