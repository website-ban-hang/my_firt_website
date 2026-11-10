const Store = require("../models/Store");

class StoreController {
  async poststorage(req, res) {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn hình ảnh sản phẩm" });
    }

    const { title, status, money } = req.body || {};
    const price = Number(money);
    if (!title || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({ success: false, message: "Tên hoặc giá sản phẩm không hợp lệ" });
    }

    try {
      const file = await Store.create({
        title,
        status,
        img: req.file.filename,
        uer: req.userId,
        money: price,
      });
      return res.status(201).json({ success: true, message: "Thêm sản phẩm thành công", file });
    } catch (error) {
      console.error("Create product error:", error);
      return res.status(500).json({ success: false, message: "Không thể thêm sản phẩm" });
    }
  }

  async getstorage(req, res) {
    try {
      const list = await Store.find({});
      return res.json({ success: true, list });
    } catch (error) {
      console.error("Get products error:", error);
      return res.status(500).json({ success: false, message: "Không thể tải danh sách sản phẩm" });
    }
  }

 async getkhachvanglai(req, res) {
    try {
        const list = await Store.find({});

        return res.json({
            success: true,
            list
        });
    } catch (error) {
        console.error("Get guest products error:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể tải danh sách sản phẩm"
        });
    }
}

  async deletestorage(req, res) {
    try {
      // The existing Store schema uses the legacy field name "uer".
      const deleted = await Store.findOneAndDelete({ _id: req.params.id, uer: req.userId });
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm hoặc bạn không có quyền xóa" });
      }
      return res.json({ success: true, message: "Xóa sản phẩm thành công", deletecard: deleted });
    } catch (error) {
      console.error("Delete product error:", error);
      return res.status(500).json({ success: false, message: "Không thể xóa sản phẩm" });
    }
  }

  async putstorage(req, res) {
    const { title, status, money } = req.body || {};
    const update = {};
    if (title !== undefined) update.title = title;
    if (status !== undefined) update.status = status;
    if (money !== undefined) {
      const price = Number(money);
      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({ success: false, message: "Giá sản phẩm không hợp lệ" });
      }
      update.money = price;
    }
    if (req.file) update.img = req.file.filename;

    try {
      const updated = await Store.findOneAndUpdate(
        { _id: req.params.id, uer: req.userId },
        { $set: update },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm hoặc bạn không có quyền sửa" });
      }
      return res.json({ success: true, message: "Cập nhật sản phẩm thành công", listpost: updated });
    } catch (error) {
      console.error("Update product error:", error);
      return res.status(500).json({ success: false, message: "Không thể cập nhật sản phẩm" });
    }
  }

  async detailstorage(req, res) {
    try {
      const detail = await Store.findById(req.params.id);
      if (!detail) {
        return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
      }
      return res.json({ success: true, message: "Tải chi tiết thành công", detail: [detail] });
    } catch (error) {
      console.error("Get product detail error:", error);
      return res.status(500).json({ success: false, message: "Không thể tải chi tiết sản phẩm" });
    }
  }
}

module.exports = new StoreController();
