const fs = require("fs");
const path = require("path");
const Store = require("../models/Store");

const publicProduct = (product) => {
  const result = product && typeof product.toObject === "function" ? product.toObject() : { ...product };
  if (result.img) result.img = `store/image/${result._id}`;
  delete result.imageData;
  delete result.imageContentType;
  return result;
};

class StoreController {
  async poststorage(req, res) {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn hình ảnh sản phẩm" });
    }

    const { title, status, money } = req.body || {};
    const price = Number(money);
    if (!title || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({ success: false, message: "Tên hoặc giá sản phẩm không hợp lệ" });
    }

    try {
      const product = new Store({
        title,
        status,
        money: price,
        uer: req.userId,
        img: "",
        imageData: req.file.buffer.toString("base64"),
        imageContentType: req.file.mimetype,
      });
      product.img = `store/image/${product._id}`;
      await product.save();
      return res.status(201).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        file: publicProduct(product),
      });
    } catch (error) {
      console.error("Create product error:", error && error.name);
      return res.status(500).json({ success: false, message: "Không thể thêm sản phẩm" });
    }
  }

  async getimage(req, res) {
    try {
      const product = await Store.findById(req.params.id).select("imageData imageContentType img");
      if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy ảnh sản phẩm" });

      if (product.imageData) {
        const image = Buffer.from(product.imageData, "base64");
        res.set("Content-Type", product.imageContentType || "application/octet-stream");
        res.set("Cache-Control", "public, max-age=300");
        return res.status(200).send(image);
      }

      // Best-effort compatibility for older uploads that may still exist in this
      // warm function's temporary directory. Vercel does not guarantee persistence.
      if (product.img) {
        const legacyName = path.basename(product.img);
        const candidates = [
          path.join("/tmp/uploads", legacyName),
          path.join(__dirname, "../public", legacyName),
        ];
        const legacyPath = candidates.find((candidate) => fs.existsSync(candidate));
        if (legacyPath) {
          res.set("Cache-Control", "no-store");
          return res.sendFile(legacyPath);
        }
      }
      return res.status(404).json({
        success: false,
        message: "Ảnh cũ không còn trên máy chủ. Vui lòng tải lại ảnh cho sản phẩm này.",
      });
    } catch (error) {
      console.error("Get product image error:", error && error.name);
      return res.status(500).json({ success: false, message: "Không thể tải ảnh sản phẩm" });
    }
  }

  async getstorage(req, res) {
    try {
      const list = await Store.find({}).lean();
      return res.json({ success: true, list: list.map(publicProduct) });
    } catch (error) {
      console.error("Get products error:", error && error.name);
      return res.status(500).json({ success: false, message: "Không thể tải danh sách sản phẩm" });
    }
  }

  async getkhachvanglai(req, res) {
    try {
      const list = await Store.find({}).lean();
      return res.json({ success: true, list: list.map(publicProduct) });
    } catch (error) {
      console.error("Get guest products error:", error && error.name);
      return res.status(500).json({ success: false, message: "Không thể tải danh sách sản phẩm" });
    }
  }

  async deletestorage(req, res) {
    try {
      const deleted = await Store.findOneAndDelete({ _id: req.params.id, uer: req.userId });
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm hoặc bạn không có quyền xóa" });
      }
      return res.json({ success: true, message: "Xóa sản phẩm thành công", deletecard: deleted });
    } catch (error) {
      console.error("Delete product error:", error && error.name);
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
    if (req.file && req.file.buffer) {
      update.imageData = req.file.buffer.toString("base64");
      update.imageContentType = req.file.mimetype;
      update.img = `store/image/${req.params.id}`;
    }

    try {
      const updated = await Store.findOneAndUpdate(
        { _id: req.params.id, uer: req.userId },
        { $set: update },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm hoặc bạn không có quyền sửa" });
      }
      return res.json({ success: true, message: "Cập nhật sản phẩm thành công", listpost: publicProduct(updated) });
    } catch (error) {
      console.error("Update product error:", error && error.name);
      return res.status(500).json({ success: false, message: "Không thể cập nhật sản phẩm" });
    }
  }

  async detailstorage(req, res) {
    try {
      const detail = await Store.findById(req.params.id);
      if (!detail) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
      return res.json({
        success: true,
        message: "Tải chi tiết thành công",
        detail: [publicProduct(detail)],
      });
    } catch (error) {
      console.error("Get product detail error:", error && error.name);
      return res.status(500).json({ success: false, message: "Không thể tải chi tiết sản phẩm" });
    }
  }
}

module.exports = new StoreController();
