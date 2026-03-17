const khachhangmodel = require("../model/khachhang.model");
const CTDonHangModel = require("../model/CTDonHang.model");
const DonHangModel = require("../model/DonHang.model");

const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");


// Get By ID
exports.get1 = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string")
      return res.send({ Messager: "ReqBody Lỗi" });

    const data = await khachhangmodel.findById(id);

    if (!data)
      return res.send({ Messager: "Không Có Khách Hàng Thuộc ID này" });

    res.send({
      id: data._id,
      HoTen: data.HoTen,
      Email: data.Email,
      Anh: data.Anh,
      DiachiKH: data.DiachiKH,
      DienthoaiKH: data.DienthoaiKH,
      Ngaysinh: data.Ngaysinh,
      Role: data.Role,
    });
  } catch {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};


// Get List
exports.getAll = async (req, res) => {
  try {
    const data = await khachhangmodel.find();
    res.send(data);
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};


// Get List For Admin
exports.getAllforadmin = async (req, res) => {
  try {
    const data = await khachhangmodel.find(
      { Role: req.params.Role },
      { Taikhoan: 1, HoTen: 1, Email: 1, Role: 1 }
    );

    if (!data.length) return res.status(404).send("Not Found");

    res.status(200).send(data);
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};


// Pagination Admin
exports.getAllforadminPagination = async (req, res) => {
  try {
    const { page, limit, Role } = req.params;

    const count = await khachhangmodel.countDocuments({ Role });

    if (count === 0)
      return res.send({ Messager: "Hiện Không Có Tài Khoản Trong Role Này" });

    const data = await khachhangmodel
      .find({ Role }, { Taikhoan: 1, HoTen: 1, Email: 1, Role: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).send({ data, count });
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};


// Get by username
exports.gettk = async (req, res) => {
  try {
    const { tk } = req.params;

    if (!tk) return res.send({ Messager: "ReqBody Lỗi" });

    const data = await khachhangmodel.find({
      $text: { $search: tk },
    });

    if (data.length > 0) return res.send(data);

    res.send(null);
  } catch {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};


// Set Role
exports.setRole = async (req, res) => {
  try {
    if (!req.body.id) return res.send({ Messager: "ReqBody Lỗi" });

    await Promise.all(
      req.body.id.map((item) =>
        khachhangmodel.findByIdAndUpdate(item, { Role: true })
      )
    );

    res.send({ Messager: "Cấp Quyền Thành Công" });
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { Taikhoan, Matkhau } = req.body;

    if (!Taikhoan || !Matkhau)
      return res.send({ Messager: "ReqBody Lỗi" });

    const users = await khachhangmodel.find({
      $text: { $search: Taikhoan },
    });

    if (!users.length)
      return res.send({ data: null, Messenger: "Đăng Nhập Thất Bại" });

    for (const user of users) {
      const sosanh = await bcrypt.compare(Matkhau, user.Matkhau);

      if (sosanh) {
        return res.send({
          Messenger: "Đăng Nhập Thành Công",
          id: user.id,
          HoTen: user.HoTen,
          Email: user.Email,
          DienthoaiKH: user.DienthoaiKH,
          Role: user.Role,
        });
      }
    }

    res.send({
      data: null,
      Messenger: "Sai Mật Khẩu Vui Lòng Nhập Lại",
    });
  } catch {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};


// Register
exports.insert = async (req, res) => {
  try {
    const { HoTen, Taikhoan, Matkhau, ConfirmMatKhau } = req.body;

    if (!HoTen || !Taikhoan || !Matkhau || !ConfirmMatKhau)
      return res.send({ Messager: "ReqBody Lỗi" });

    if (Matkhau !== ConfirmMatKhau)
      return res.send({ Messenger: "Mật Khẩu Không Trùng Nhau" });

    const check = await khachhangmodel.find({
      $text: { $search: Taikhoan },
    });

    if (check.length > 0) {
      return res.send({
        Messenger: "Tài Khoản Bị Trùng",
        Taikhoan: check[0].Taikhoan,
      });
    }

    const signup = new khachhangmodel(req.body);
    await signup.save();

    res.send({
      Messenger: "Đăng Ký Thành Công",
      id: signup._id,
      Taikhoan: signup.Taikhoan,
      HoTen: signup.HoTen,
      Role: signup.Role,
    });
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};


// Create Admin
exports.createadmin = async (req, res) => {
  try {
    const { HoTen, Taikhoan, Matkhau, ConfirmMatKhau } = req.body;

    if (!HoTen || !Taikhoan || !Matkhau || !ConfirmMatKhau)
      return res.send({ Messager: "ReqBody Lỗi" });

    if (Matkhau !== ConfirmMatKhau)
      return res.send({ Messenger: "Mật Khẩu Không Trùng Nhau" });

    const check = await khachhangmodel.find({
      $text: { $search: Taikhoan },
    });

    if (check.length > 0) {
      return res.send({
        Messenger: "Tài Khoản Bị Trùng",
        Taikhoan: check[0].Taikhoan,
      });
    }

    const signup = new khachhangmodel({
      HoTen,
      Taikhoan,
      Matkhau,
      Role: true,
    });

    await signup.save();

    res.send({
      Messenger: "Đăng Ký Thành Công",
      id: signup._id,
      Taikhoan: signup.Taikhoan,
      HoTen: signup.HoTen,
      Role: signup.Role,
    });
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};


// Update User
exports.update = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.send({ Messager: "ReqBody Lỗi" });

    await khachhangmodel.findByIdAndUpdate(id, {
      Anh: req.body.Anh,
      HoTen: req.body.HoTen,
      Email: req.body.Email,
      DiachiKH: req.body.DiachiKH,
      DienthoaiKH: req.body.DienthoaiKH,
      Ngaysinh: req.body.Ngaysinh,
    });

    const data = await khachhangmodel.findById(id);

    res.send({
      Messenger: "Cập Nhật Thành Công",
      id: data._id,
      Taikhoan: data.Taikhoan,
      Anh: data.Anh,
      HoTen: data.HoTen,
      Email: data.Email,
      DiachiKH: data.DiachiKH,
      DienthoaiKH: data.DienthoaiKH,
      Ngaysinh: data.Ngaysinh,
    });
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};


// Update Password
exports.updatemk = async (req, res) => {
  try {
    const { id, Matkhaued, newMatkhau, ConfirmMatKhau } = req.body;

    if (!id || !Matkhaued || !newMatkhau || !ConfirmMatKhau)
      return res.send({ Messager: "ReqBody Lỗi" });

    const user = await khachhangmodel.findById(id);

    const sosanh = await bcrypt.compare(Matkhaued, user.Matkhau);
    const sosanh2 = await bcrypt.compare(newMatkhau, user.Matkhau);

    if (sosanh2)
      return res.send({
        Messenger: "Vui Lòng Điền Mật Khẩu Khác Với Mật Khẩu Cũ",
      });

    if (!sosanh)
      return res.send({ Messenger: "Mật Khẩu Sai Vui Lòng Nhập Lại" });

    if (newMatkhau !== ConfirmMatKhau)
      return res.send({ Messenger: "Mật Khẩu Không Trùng Nhau" });

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(newMatkhau, salt);

    await khachhangmodel.findByIdAndUpdate(id, {
      Matkhau: passwordHashed,
    });

    const data = await khachhangmodel.findById(id);

    res.send({
      Messenger: "Cập Nhật Thành Công",
      id: data._id,
      Taikhoan: data.Taikhoan,
    });
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};


// Delete User
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.send({ Messager: "ReqBody Lỗi" });

    await khachhangmodel.findByIdAndDelete(id);

    const MaDonHang = await DonHangModel.aggregate([
      { $match: { MaKH: id } },
      { $project: { _id: 0, id: { $toString: "$_id" } } },
    ]);

    if (MaDonHang.length === 0)
      return res.send({ Messager: "Khách Hàng Này Chưa Có Đơn Để Xóa" });

    await DonHangModel.deleteMany({ MaKH: id });

    await Promise.all(
      MaDonHang.map((data) =>
        CTDonHangModel.deleteMany({
          MaDonHang: ObjectId(data.id),
        })
      )
    );

    res.send({ Messager: "Xóa Thành Công" });
  } catch {
    res.send({ Messager: "API Lỗi" });
  }
};