import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiArrowRight, FiBookOpen, FiCalendar, FiChevronRight, FiLeaf } from "react-icons/fi";
import { PORT } from "../../constants";
import "./BlogPage.css";

const imageFor = id => `${PORT}articles/image/${id}`;
const dateFor = value => value ? new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" }) : "Tin mới";

function ArticleBody({ content = "" }) {
  return <div className="ha-article-content">{content.split(/\r?\n/).map((raw, index) => {
    const line = raw.trim();
    if (!line) return <div className="ha-article-space" key={index}/>;
    if (line.startsWith("### ")) return <h3 key={index}>{line.slice(4)}</h3>;
    if (line.startsWith("## ")) return <h2 key={index}>{line.slice(3)}</h2>;
    if (line.startsWith("# ")) return <h2 key={index}>{line.slice(2)}</h2>;
    if (line.startsWith("- ") || line.startsWith("• ")) return <p className="ha-article-bullet" key={index}>{line.slice(2)}</p>;
    return <p key={index}>{line}</p>;
  })}</div>;
}

function BlogPage() {
  const { id } = useParams();
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const request = id ? axios.get(`${PORT}articles/${id}`) : axios.get(`${PORT}articles`);
    request.then(response => {
      if (!active) return;
      if (id) setArticle(response.data.article);
      else setArticles(response.data.articles || []);
    }).catch(err => {
      if (active) setError(err.response?.data?.message || "Không thể tải nội dung. Vui lòng thử lại.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (id) return <main className="ha-blog ha-blog-article-page">
    <header className="ha-blog-header">
      <Link to="/" className="ha-blog-brand"><span>HA+</span><b>HOÀNG ÁNH <small>ĐIỆN MÁY</small></b></Link>
      <Link to="/blog" className="ha-blog-back"><FiArrowLeft/> Tất cả bài viết</Link>
    </header>
    <section className="ha-article-hero">
      <div className="ha-article-hero-inner">
        <div className="ha-article-breadcrumb"><Link to="/">Trang chủ</Link><FiChevronRight/><Link to="/blog">Về chúng tôi</Link><FiChevronRight/><span>{loading ? "Đang tải bài viết" : article?.category || "Bài viết"}</span></div>
        {loading ? <div className="ha-blog-state">Đang tải bài viết...</div> : error ? <div className="ha-blog-state">{error}</div> : article && <>
          <span className="ha-article-eyebrow"><FiLeaf/> CÂU CHUYỆN TỪ HOÀNG ÁNH ĐIỆN MÁY</span>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="ha-article-meta"><span><FiCalendar/> {dateFor(article.publishedAt || article.createdAt)}</span><i/> <span><FiBookOpen/> {article.category || "Tin cửa hàng"}</span></div>
        </>}
      </div>
      <div className="ha-article-hero-leaf" aria-hidden="true"/>
    </section>
    {article && !loading && !error && <div className="ha-article-layout">
      <article className="ha-article-paper">
        <div className="ha-article-paper-top"><span><FiLeaf/> HOÀNG ÁNH ĐIỆN MÁY</span><span>CHIA SẺ & KẾT NỐI</span></div>
        {article.hasCoverImage && <img className="ha-article-cover" src={imageFor(article._id)} alt={article.title}/>}
        <ArticleBody content={article.content}/>
        <div className="ha-article-signoff"><span className="ha-article-signoff-leaf"><FiLeaf/></span><div><strong>HOÀNG ÁNH ĐIỆN MÁY</strong><p>Chân thành cảm ơn quý khách đã luôn tin tưởng và đồng hành.</p></div></div>
        <Link to="/blog" className="ha-blog-return"><FiArrowLeft/> Khám phá thêm bài viết</Link>
      </article>
      <aside className="ha-article-aside">
        <div className="ha-article-aside-card"><span className="ha-aside-leaf"><FiLeaf/></span><span className="ha-blog-eyebrow">LỜI CHÀO TỪ CHÚNG TÔI</span><h3>Cuộc sống tiện nghi bắt đầu từ những lựa chọn tốt.</h3><p>Hoàng Ánh Điện Máy luôn mong muốn đồng hành cùng gia đình bạn trong từng khoảnh khắc thường ngày.</p><Link to="/">Khám phá cửa hàng <FiArrowRight/></Link></div>
        <Link to="/blog" className="ha-article-aside-link"><FiBookOpen/> Xem tất cả bài viết <FiArrowRight/></Link>
      </aside>
    </div>}
    <footer className="ha-blog-footer">© {new Date().getFullYear()} HOÀNG ÁNH ĐIỆN MÁY · Chia sẻ thông tin hữu ích đến khách hàng</footer>
  </main>;

  return <main className="ha-blog"><header className="ha-blog-header"><Link to="/" className="ha-blog-brand"><span>HA+</span><b>HOÀNG ÁNH <small>ĐIỆN MÁY</small></b></Link><nav><Link to="/">Trang chủ</Link><Link className="active" to="/blog">Về chúng tôi</Link></nav></header>
    <section className="ha-blog-hero"><div className="ha-blog-hero-inner"><span className="ha-blog-eyebrow"><FiBookOpen/> CÂU CHUYỆN & TIN TỨC</span><h1>Góc chia sẻ<br/><em>Hoàng Ánh Điện Máy</em></h1><p>Những câu chuyện về cửa hàng, kiến thức điện nước hữu ích và các cập nhật mới nhất dành cho bạn.</p><span className="ha-blog-hero-line"/></div><div className="ha-blog-hero-mark">HA<span>+</span></div></section>
    <section className="ha-blog-list-section"><div className="ha-blog-section-title"><div><span className="ha-blog-eyebrow">TỪ CỬA HÀNG CHÚNG TÔI</span><h2>Bài viết mới nhất</h2><p>Cập nhật thông tin và chia sẻ cùng khách hàng.</p></div><span className="ha-blog-total">{articles.length} bài viết</span></div>
      {loading ? <div className="ha-blog-state">Đang tải bài viết...</div> : error ? <div className="ha-blog-state">{error}</div> : articles.length ? <div className="ha-blog-grid">{articles.map((item,index)=><Link to={`/blog/${item._id}`} className={`ha-blog-card ${index===0?"featured":""}`} key={item._id}><div className="ha-blog-card-image">{item.hasCoverImage ? <img src={imageFor(item._id)} alt={item.title}/> : <div className="ha-blog-placeholder"><span>HA+</span><small>HOÀNG ÁNH ĐIỆN MÁY</small></div>}<span className="ha-blog-category">{item.category || "Tin cửa hàng"}</span></div><div className="ha-blog-card-body"><span className="ha-blog-date"><FiCalendar/> {dateFor(item.publishedAt || item.createdAt)}</span><h3>{item.title}</h3><p>{item.excerpt}</p><span className="ha-blog-read">Đọc bài viết <FiArrowRight/></span></div></Link>)}</div> : <div className="ha-blog-empty"><span><FiBookOpen/></span><h3>Bài viết đang được chuẩn bị</h3><p>Các tin tức và câu chuyện mới của Hoàng Ánh Điện Máy sẽ sớm xuất hiện tại đây.</p><Link to="/">Quay lại trang chủ <FiChevronRight/></Link></div>}
    </section><footer className="ha-blog-footer">© {new Date().getFullYear()} HOÀNG ÁNH ĐIỆN MÁY · Chia sẻ thông tin hữu ích đến khách hàng</footer></main>;
}

export default BlogPage;
