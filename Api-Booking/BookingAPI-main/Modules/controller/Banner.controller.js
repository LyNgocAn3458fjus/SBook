const Bannermodel = require("../model/Banner.model");

// Get Banner
exports.getAll = async (req, res) => {
  try {
    const data = await Bannermodel.findById("622f37caf3f4339337026992");
    res.send(data);
  } catch (error) {
    res.send({ Messager: "Lỗi khi lấy banner" });
  }
};


// Cập nhật 3 ảnh
exports.update = async (req, res) => {
  try {
    const { Anh1, Anh2, Anh3 } = req.body;

    if (!Anh1 || !Anh2 || !Anh3) {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    const data = await Bannermodel.findByIdAndUpdate(
      "622f37caf3f4339337026992",
      {
        Anh1: Anh1,
        Anh2: Anh2,
        Anh3: Anh3,
      },
      { new: true }
    );

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};


// Cập nhật 1 ảnh
exports.update1IMAGE = async (req, res) => {
  try {
    const { NameAnh } = req.params;
    const { Image } = req.body;

    if (!NameAnh || !Image) {
      return res.send({ Messager: "ReqBody Lỗi" });
    }

    let updateData = {};

    if (NameAnh === "Anh1") {
      updateData = { Anh1: Image };
    } else if (NameAnh === "Anh2") {
      updateData = { Anh2: Image };
    } else if (NameAnh === "Anh3") {
      updateData = { Anh3: Image };
    } else {
      return res.send({ Messager: "Tên ảnh không hợp lệ" });
    }

    const data = await Bannermodel.findByIdAndUpdate(
      "622f37caf3f4339337026992",
      updateData,
      { new: true }
    );

    res.send(data);

  } catch (error) {
    res.send({ Messager: "API LỖi HOẶC REQ.BODY Trống" });
  }
};