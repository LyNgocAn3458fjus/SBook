const chudemodel = require("../model/chude.model");
const nhaxuatban = require("../model/nhaxuatban.model");
const tacgiamodel = require("../model/tacgia.model");

exports.GETALL = async (req, res) => {
  try {
    const [tacgia, NXB, chude] = await Promise.all([
      tacgiamodel.find({ status: false }),
      nhaxuatban.find({ status: false }),
      chudemodel.find({ status: false }),
    ]);

    return res.send({ tacgia, NXB, chude });
  } catch (error) {
    return res.send([{ Messager: "API LỖi HOẶC REQ.BODY Trống" }]);
  }
};