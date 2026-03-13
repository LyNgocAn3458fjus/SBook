module.exports = function (app) {
    var controller = require("../controller/voucher.controller");


    // API Thêm voucher theo Code
    app.get("/vouchers/:id", controller.getVoucherByCode);

    // API Thêm voucher
    app.post("/vouchers", controller.addVoucher);

    // API Thêm voucher
    app.get("/vouchers", controller.getAllVouchers);


    // API Sửa thông tin voucher theo ID
    app.put("/vouchers/:id", controller.updateVoucher);

    // API Xóa voucher theo ID
    app.delete("/vouchers/:id", controller.deleteVoucher);

    // API Lấy thông tin voucher theo ID
    app.get("/vouchers/:id", controller.getVoucherById);

    // API Áp dụng voucher
    app.post("/vouchers/apply", controller.applyVoucher);

};
