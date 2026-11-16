import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiArrowRight, FiBookOpen, FiCalendar, FiChevronRight } from "react-icons/fi";
import { PORT } from "../../constants";
import "./BlogPage.css";

const imageFor = id => `${PORT}articles/image/${id}`;
const dateFor = value => value ? new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" }) : "Tin mới";

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

  if (id) return <main className="ha-blog"><header className="ha-blog-header"><Link to="/" className="ha-blog-brand"><span>HA+</span><b>HOÀNG ÁNH <small>ĐIỆN MÁY</small></b></Link><Link to="/blog" className="ha-blog-back"><FiArrowLeft/> Tất cả bài viết</Link></header>
    <article className="ha-article-detail">{loading ? <div className="ha-blog-state">Đang tải bài viết...</div> : error ? <div className="ha-blog-state">{error}</div> : article && <><div className="ha-article-kicker">{article.category || "Tin cửa hàng"} <span>·</span> <FiCalendar/> {dateFor(article.publishedAt || article.createdAt)}</div><h1>{article.title}</h1><p className="ha-article-lead">{article.excerpt}</p>{article.hasCoverImage && <img className="ha-article-cover" src={imageFor(article._id)} alt={article.title}/>}<div className="ha-article-content">{article.content.split(/\r?\n/).map((line,index) => line.trim() ? <p key={index}>{line}</p> : <div className="ha-article-space" key={index}/>)}</div><Link to="/blog" className="ha-blog-return"><FiArrowLeft/> Quay lại Blog</Link></>}</article>
    <footer className="ha-blog-footer">© {new Date().getFullYear()} HOÀNG ÁNH ĐIỆN MÁY · Chia sẻ thông tin hữu ích đến khách hàng</footer></main>;

  return <main className="ha-blog"><header className="ha-blog-header"><Link to="/" className="ha-blog-brand"><span>HA+</span><b>HOÀNG ÁNH <small>ĐIỆN MÁY</small></b></Link><nav><Link to="/">Trang chủ</Link><Link className="active" to="/blog">Về chúng tôi</Link></nav></header>
    <section className="ha-blog-hero"><div className="ha-blog-hero-inner"><span className="ha-blog-eyebrow"><FiBookOpen/> CÂU CHUYỆN & TIN TỨC</span><h1>Góc chia sẻ<br/><em>Hoàng Ánh Điện Máy</em></h1><p>Những câu chuyện về cửa hàng, kiến thức điện nước hữu ích và các cập nhật mới nhất dành cho bạn.</p><span className="ha-blog-hero-line"/></div><div className="ha-blog-hero-mark">HA<span>+</span></div></section>
    <section className="ha-blog-list-section"><div className="ha-blog-section-title"><div><span className="ha-blog-eyebrow">TỪ CỬA HÀNG CHÚNG TÔI</span><h2>Bài viết mới nhất</h2><p>Cập nhật thông tin và chia sẻ cùng khách hàng.</p></div><span className="ha-blog-total">{articles.length} bài viết</span></div>
      {loading ? <div className="ha-blog-state">Đang tải bài viết...</div> : error ? <div className="ha-blog-state">{error}</div> : articles.length ? <div className="ha-blog-grid">{articles.map((item,index)=><Link to={`/blog/${item._id}`} className={`ha-blog-card ${index===0?"featured":""}`} key={item._id}><div className="ha-blog-card-image">{item.hasCoverImage ? <img src={imageFor(item._id)} alt={item.title}/> : <div className="ha-blog-placeholder"><span>HA+</span><small>HOÀNG ÁNH ĐIỆN MÁY</small></div>}<span className="ha-blog-category">{item.category || "Tin cửa hàng"}</span></div><div className="ha-blog-card-body"><span className="ha-blog-date"><FiCalendar/> {dateFor(item.publishedAt || item.createdAt)}</span><h3>{item.title}</h3><p>{item.excerpt}</p><span className="ha-blog-read">Đọc bài viết <FiArrowRight/></span></div></Link>)}</div> : <div className="ha-blog-empty"><span><FiBookOpen/></span><h3>Bài viết đang được chuẩn bị</h3><p>Các tin tức và câu chuyện mới của Hoàng Ánh Điện Máy sẽ sớm xuất hiện tại đây.</p><Link to="/">Quay lại trang chủ <FiChevronRight/></Link></div>}
    </section><footer className="ha-blog-footer">© {new Date().getFullYear()} HOÀNG ÁNH ĐIỆN MÁY · Chia sẻ thông tin hữu ích đến khách hàng</footer></main>;
}

export default BlogPage;
