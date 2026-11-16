const Article = require("../models/Article");

const publicArticle = (article) => {
  const item = article && typeof article.toObject === "function" ? article.toObject() : { ...article };
  delete item.coverImageData;
  delete item.coverImageContentType;
  item.hasCoverImage = Boolean(article.coverImageData);
  return item;
};

class ArticleController {
  async listPublic(req, res) {
    try {
      const articles = await Article.find({ status: "published" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean();
      return res.json({ success: true, articles: articles.map(publicArticle) });
    } catch (error) {
      console.error("Public article list error:", error && error.name);
      return res.status(500).json({ success: false, message: "Không thể tải bài viết" });
    }
  }

  async detailPublic(req, res) {
    try {
      const article = await Article.findOne({ _id: req.params.id, status: "published" })
        .lean();
      if (!article) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
      return res.json({ success: true, article: publicArticle(article) });
    } catch (error) {
      return res.status(400).json({ success: false, message: "Mã bài viết không hợp lệ" });
    }
  }

  async image(req, res) {
    try {
      const article = await Article.findById(req.params.id).select("coverImageData coverImageContentType");
      if (!article || !article.coverImageData) return res.status(404).json({ success: false, message: "Không tìm thấy ảnh bài viết" });
      res.set("Content-Type", article.coverImageContentType || "application/octet-stream");
      res.set("Cache-Control", "public, max-age=3600");
      return res.status(200).send(Buffer.from(article.coverImageData, "base64"));
    } catch (error) {
      return res.status(400).json({ success: false, message: "Không thể tải ảnh bài viết" });
    }
  }

  async listAdmin(req, res) {
    try {
      const articles = await Article.find({}).sort({ updatedAt: -1 }).lean();
      return res.json({ success: true, articles: articles.map(publicArticle) });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Không thể tải danh sách bài viết" });
    }
  }

  async create(req, res) {
    const { title, excerpt, content, category, status } = req.body || {};
    if (!String(title || "").trim() || !String(excerpt || "").trim() || !String(content || "").trim()) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập tiêu đề, tóm tắt và nội dung bài viết" });
    }
    try {
      const published = status === "published";
      const article = await Article.create({
        title: String(title).trim(), excerpt: String(excerpt).trim(), content: String(content).trim(),
        category: String(category || "Tin cửa hàng").trim(), status: published ? "published" : "draft",
        author: req.userId, publishedAt: published ? new Date() : null,
        coverImageData: req.file ? req.file.buffer.toString("base64") : "",
        coverImageContentType: req.file ? req.file.mimetype : ""
      });
      return res.status(201).json({ success: true, message: "Đã tạo bài viết", article: publicArticle(article) });
    } catch (error) {
      console.error("Create article error:", error && error.name);
      return res.status(500).json({ success: false, message: "Không thể lưu bài viết" });
    }
  }

  async update(req, res) {
    const { title, excerpt, content, category, status } = req.body || {};
    if (!String(title || "").trim() || !String(excerpt || "").trim() || !String(content || "").trim()) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập tiêu đề, tóm tắt và nội dung bài viết" });
    }
    try {
      const article = await Article.findById(req.params.id);
      if (!article) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
      const wasPublished = article.status === "published";
      article.title = String(title).trim();
      article.excerpt = String(excerpt).trim();
      article.content = String(content).trim();
      article.category = String(category || "Tin cửa hàng").trim();
      article.status = status === "published" ? "published" : "draft";
      if (article.status === "published" && !wasPublished) article.publishedAt = new Date();
      if (article.status === "draft") article.publishedAt = null;
      if (req.file) {
        article.coverImageData = req.file.buffer.toString("base64");
        article.coverImageContentType = req.file.mimetype;
      }
      await article.save();
      return res.json({ success: true, message: "Đã cập nhật bài viết", article: publicArticle(article) });
    } catch (error) {
      console.error("Update article error:", error && error.name);
      return res.status(400).json({ success: false, message: "Không thể cập nhật bài viết" });
    }
  }

  async remove(req, res) {
    try {
      const deleted = await Article.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
      return res.json({ success: true, message: "Đã xóa bài viết" });
    } catch (error) {
      return res.status(400).json({ success: false, message: "Không thể xóa bài viết" });
    }
  }
}

module.exports = new ArticleController();
