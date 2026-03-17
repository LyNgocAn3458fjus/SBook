const fs = require("fs");
const path = require("path");

// Upload Image
exports.UploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.send({ Messager: "Không tìm thấy ảnh trong kho" });
    }

    res.send({
      data: `/open-image/${req.file.filename}`,
    });
  } catch (error) {
    res.send({ Messager: "Upload ảnh thất bại" });
  }
};

// Load Image
exports.loadimgage = async (req, res) => {
  try {
    const { filename } = req.params;
    const imgPath = path.join("images", "upload", filename);

    if (!fs.existsSync(imgPath)) {
      return res.send({ Messager: "Không tìm thấy ảnh trong kho" });
    }

    const data = await fs.promises.readFile(imgPath);

    res.writeHead(200, {
      "Content-Type": "image/jpeg",
    });

    res.end(data);
  } catch (error) {
    res.send({ Messager: "Không tìm thấy ảnh trong kho" });
  }
};