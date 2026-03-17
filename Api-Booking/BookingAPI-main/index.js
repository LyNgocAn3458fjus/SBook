// Body Parser - Hỗ trợ đọc dữ liệu JSON từ request
const bodyParser = require("body-parser");

// Express framework
const express = require("express");

// Mongoose kết nối MongoDB
const mongoose = require("mongoose");

const app = express();

// Giao diện UI cho API
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Mở giới hạn upload file lớn
app.use(bodyParser.json({ limit: "50mb", parameterLimit: 1000000 }));

// Cấu hình CORS để frontend gọi API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, HEAD, OPTIONS"
  );
  next();
});

// Middleware bắt lỗi
app.use((err, req, res, next) => {
  if (err) {
    res.send({ Messager: err.type });
  }
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// ================= ROUTES =================

require("./Modules/routes/chude.route")(app);
require("./Modules/routes/khachhang.route")(app);
require("./Modules/routes/DonHang.route")(app);
require("./Modules/routes/CTDonHang.route")(app);
require("./Modules/routes/nhaxuatban.route")(app);
require("./Modules/routes/sach.route")(app);
require("./Modules/routes/tacgia.route")(app);
require("./Modules/routes/Banner.route")(app);
require("./Modules/routes/UploadImage.route")(app);
require("./Modules/routes/GETCDTGNXB.route")(app);
require("./Modules/routes/Vouchers.route")(app);
require("./Modules/routes/SendMail.route")(app);

// ================= MONGODB CONNECT =================

// Tắt warning strictQuery
mongoose.set("strictQuery", false);

const uri =
  "mongodb+srv://lyngocan_db:xCSe9RzISoChTmD4@reactjs-blogging-websit.9g9u6tr.mongodb.net/Book?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    try {
      const host = "0.0.0.0";
      const port = process.env.PORT || 3000;

      app.listen(port, host, function () {
        console.log("Server running at http://" + host + ":" + port);
      });

    } catch (error) {
      console.log(error);
    }
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });