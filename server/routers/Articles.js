const express = require("express");
const multer = require("multer");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const verifyAdmin = require("../middleware/admin");
const controller = require("../controllers/articleController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return callback(new Error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP"));
    }
    callback(null, true);
  }
});
const uploadCover = (req, res, next) => upload.single("cover")(req, res, error => {
  if (!error) return next();
  return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
    success: false,
    message: error.code === "LIMIT_FILE_SIZE" ? "Ảnh bìa tối đa 4 MB" : error.message || "Không thể tải ảnh lên"
  });
});

router.get("/image/:id", controller.image);
router.get("/", controller.listPublic);
router.get("/:id", controller.detailPublic);
router.get("/admin/all", verifyToken, verifyAdmin, controller.listAdmin);
router.post("/", verifyToken, verifyAdmin, uploadCover, controller.create);
router.put("/:id", verifyToken, verifyAdmin, uploadCover, controller.update);
router.delete("/:id", verifyToken, verifyAdmin, controller.remove);

module.exports = router;
