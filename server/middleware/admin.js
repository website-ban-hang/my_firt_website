const User = require("../models/User");

module.exports = async function verifyAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("admin");
    if (!user || user.admin !== true) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền quản trị" });
    }
    return next();
  } catch (error) {
    console.error("Admin authorization error:", error && error.name);
    return res.status(500).json({ success: false, message: "Không thể xác minh quyền quản trị" });
  }
};
