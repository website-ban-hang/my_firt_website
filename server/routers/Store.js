const express = require("express");
const multer = require("multer");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");
const storecontroller = require("../controllers/storecontroller");

// Vercel functions have ephemeral filesystems. Keep small product images in MongoDB.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) {
      return callback(new Error("Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc GIF"));
    }
    callback(null, true);
  },
});

const uploadProductImage = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) return next();
    const tooLarge = error.code === "LIMIT_FILE_SIZE";
    return res.status(tooLarge ? 413 : 400).json({
      success: false,
      message: tooLarge
        ? "Ảnh quá lớn. Vui lòng chọn ảnh không quá 3 MB."
        : error.message || "Không thể nhận ảnh tải lên",
    });
  });
};

router.post("/", verifyToken, verifyAdmin, uploadProductImage, storecontroller.poststorage);
router.get("/image/:id", storecontroller.getimage);
router.get("/getlistCart", verifyToken, verifyAdmin, storecontroller.getstorage);
router.get("/getlistCartreturnguest", storecontroller.getkhachvanglai);
router.delete("/deletecart/:id", verifyToken, verifyAdmin, storecontroller.deletestorage);
router.put("/editcart/:id", verifyToken, verifyAdmin, uploadProductImage, storecontroller.putstorage);
router.get("/detailcart/:id", verifyToken, verifyAdmin, storecontroller.detailstorage);

module.exports = router;
