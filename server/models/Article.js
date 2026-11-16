const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  excerpt: { type: String, required: true, trim: true, maxlength: 360 },
  content: { type: String, required: true, trim: true, maxlength: 30000 },
  category: { type: String, trim: true, default: "Tin cửa hàng", maxlength: 60 },
  coverImageData: { type: String, default: "" },
  coverImageContentType: { type: String, default: "" },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  publishedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.models.articles || mongoose.model("articles", ArticleSchema);
