import React, { useContext, useEffect, useMemo, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PORT } from "../constants";
import { Authcontext } from "../contexts/Authcontext";
import { StorageCartContext } from "../contexts/storagecartContext";
import { storeContext } from "../contexts/StoreContext";
import "./Dashboard.css";

const PAGE_SIZE = 12;
const Dashboard = () => {
  const navigate = useNavigate();
  const { authState: { isAuathenticated }, storeLoading } = useContext(Authcontext);
  const { listpost = [], getListStore, detailcart } = useContext(storeContext);
  const { getStorageCart } = useContext(StorageCartContext);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => { getStorageCart(); getListStore(); }, []);
  const filteredPosts = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase("vi");
    if (!query) return listpost;
    return listpost.filter((item) => [item.title, item.status].some((value) => String(value || "").toLocaleLowerCase("vi").includes(query)));
  }, [listpost, searchText]);
  const pageCount = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const visiblePosts = filteredPosts.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  useEffect(() => { setCurrentPage(0); }, [searchText]);
  const openProduct = (product) => { detailcart(product); navigate(product._id); };
  if (!isAuathenticated) return <Navigate to="/login" replace />;
  if (storeLoading) return <div className="dashboard-loading"><Spinner animation="border" role="status" /><span>Đang tải danh mục thiết bị...</span></div>;

  return (
    <main className="pet-dashboard electrical-dashboard">
      <section className="dashboard-hero electrical-dashboard-hero">
        <div className="electrical-dashboard-copy">
          <span className="dashboard-eyebrow">XUÂN TRUNG ĐIỆN MÁY · THIẾT BỊ CHO MỌI NHÀ</span>
          <h1>Giải pháp điện nước<br/><em>bền bỉ mỗi ngày.</em></h1>
          <p>Máy bơm nước, thiết bị điện và vật dụng dân dụng – lựa chọn đúng nhu cầu, an tâm sử dụng lâu dài.</p>
          <a href="#san-pham" className="dashboard-hero-cta">Khám phá sản phẩm <span>→</span></a>
        </div>
        <div className="electrical-dashboard-art" aria-label="Minh họa thiết bị điện và máy bơm">
          <span className="art-bolt">⚡</span><div className="art-pump">◉<small>WATER PUMP</small></div>
          <div className="art-device art-device-one">🔌</div><div className="art-device art-device-two">💡</div>
          <span className="art-caption">POWER · WATER · HOME</span>
        </div>
      </section>

      <section className="dashboard-benefits" aria-label="Cam kết cửa hàng">
        <div><span className="benefit-icon">✓</span><div><strong>Tư vấn đúng thông số</strong><small>Chọn thiết bị phù hợp nhu cầu</small></div></div>
        <div><span className="benefit-icon">⚡</span><div><strong>Thiết bị chất lượng</strong><small>Ưu tiên an toàn và độ bền</small></div></div>
        <div><span className="benefit-icon">↗</span><div><strong>Hỗ trợ tận tâm</strong><small>Đồng hành trước và sau mua</small></div></div>
      </section>

      <section className="dashboard-products" id="san-pham">
        <div className="dashboard-section-heading"><div><span className="dashboard-kicker">DANH MỤC HÀNG HÓA</span><h2>Thiết bị điện & máy bơm</h2><p>Tìm nhanh sản phẩm bạn đang cần cho gia đình và công trình.</p></div><span className="dashboard-product-count">{filteredPosts.length} sản phẩm</span></div>
        <div className="dashboard-search"><span aria-hidden="true">⌕</span><input type="search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Tìm máy bơm, dây điện, đèn, công tắc..." aria-label="Tìm sản phẩm"/>{searchText && <button type="button" onClick={() => setSearchText("")}>Xóa</button>}</div>
        {visiblePosts.length > 0 ? <Row className="g-4 dashboard-product-grid">{visiblePosts.map((product) => (
          <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
            <Card className="dashboard-product-card h-100" role="button" tabIndex={0} onClick={() => openProduct(product)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProduct(product); } }}>
              <div className="dashboard-product-image-wrap"><Card.Img variant="top" src={product.img ? `${PORT}${String(product.img).replace(/^\\/+/, "")}` : undefined} alt={product.title || "Thiết bị điện"} onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}/><span className="dashboard-product-tag">XUÂN TRUNG · ĐIỆN MÁY</span></div>
              <Card.Body><Card.Title>{product.title || "Sản phẩm"}</Card.Title><Card.Text className="dashboard-product-status">{product.status || "Thông tin sản phẩm đang được cập nhật"}</Card.Text><div className="dashboard-product-bottom"><strong>{product.money == null ? "Liên hệ" : Number(product.money).toLocaleString("vi-VN", {style:"currency",currency:"VND"})}</strong><span aria-hidden="true">→</span></div></Card.Body>
            </Card>
          </Col>
        ))}</Row> : <div className="dashboard-empty"><span>⌕</span><h3>{searchText ? "Chưa tìm thấy sản phẩm phù hợp" : "Danh mục đang được cập nhật"}</h3><p>{searchText ? "Thử từ khóa khác hoặc xóa tìm kiếm để xem toàn bộ sản phẩm." : "Sản phẩm sẽ hiển thị tại đây khi được cập nhật vào hệ thống."}</p>{searchText && <button type="button" onClick={() => setSearchText("")}>Xem tất cả sản phẩm</button>}</div>}
        {pageCount > 1 && <nav className="dashboard-pagination" aria-label="Phân trang sản phẩm"><button type="button" disabled={currentPage === 0} onClick={() => setCurrentPage((page) => page - 1)}>← Trước</button>{Array.from({length:pageCount},(_,index)=><button type="button" key={index} className={currentPage===index?"active":""} aria-current={currentPage===index?"page":undefined} onClick={()=>setCurrentPage(index)}>{index+1}</button>)}<button type="button" disabled={currentPage>=pageCount-1} onClick={()=>setCurrentPage((page)=>page+1)}>Sau →</button></nav>}
      </section>

      <section className="dashboard-location"><div className="dashboard-location-copy"><span className="dashboard-kicker">CẦN TƯ VẤN KỸ THUẬT?</span><h2>Chọn đúng thiết bị, dùng bền lâu</h2><p>Liên hệ cửa hàng để được hỗ trợ lựa chọn máy bơm, thiết bị điện và vật dụng phù hợp với nhu cầu thực tế.</p><Link to="/contact">Liên hệ tư vấn <span>→</span></Link></div><div className="electrical-contact-art">⚡<span>GIẢI PHÁP ĐIỆN & NƯỚC</span><strong>AN TOÀN · HIỆU QUẢ · BỀN BỈ</strong></div></section>

      <footer className="dashboard-footer"><div className="dashboard-footer-main"><div className="dashboard-footer-brand"><strong>XUÂN TRUNG ĐIỆN MÁY</strong><p>Thiết bị điện, máy bơm và vật dụng điện cho mọi nhà.</p></div><div><h3>Danh mục</h3><p>Máy bơm nước</p><p>Thiết bị điện</p><p>Vật dụng điện dân dụng</p></div><div><h3>Hỗ trợ khách hàng</h3><p>Tư vấn chọn thiết bị</p><p>Hỗ trợ đặt hàng</p><p>Thông tin sản phẩm minh bạch</p></div><div><h3>Liên hệ</h3><p>Việt Nam</p><p>Liên hệ qua cửa hàng</p></div></div><div className="dashboard-footer-bottom"><span>© {new Date().getFullYear()} XUÂN TRUNG ĐIỆN MÁY. All rights reserved.</span></div></footer>
    </main>
  );
};
export default Dashboard;
