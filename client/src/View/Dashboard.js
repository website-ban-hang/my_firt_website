import React, { useContext, useEffect, useMemo, useState } from "react";
import { Card, Carousel, Col, Row, Spinner } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PORT } from "../constants";
import { Authcontext } from "../contexts/Authcontext";
import { StorageCartContext } from "../contexts/storagecartContext";
import { storeContext } from "../contexts/StoreContext";
import slider from "../assets/React App_files/slider1.jpeg";
import slider2 from "../assets/React App_files/slider2.jpeg";
import slider3 from "../assets/React App_files/slider3.jpeg";
import map from "../assets/React App_files/map.png";
import logoauthentication from "../assets/React App_files/logoauthentication.jpeg";
import logowebwite from "../assets/React App_files/logoweb.jpeg";
import "./Dashboard.css";

const PAGE_SIZE = 12;

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    authState: { isAuathenticated },
    storeLoading,
  } = useContext(Authcontext);
  const { listpost = [], getListStore, detailcart } = useContext(storeContext);
  const { getStorageCart } = useContext(StorageCartContext);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getStorageCart();
    getListStore();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase("vi");
    if (!query) return listpost;
    return listpost.filter((item) =>
      (item.title || "").toLocaleLowerCase("vi").includes(query)
    );
  }, [listpost, searchText]);

  const pageCount = Math.ceil(filteredPosts.length / PAGE_SIZE);
  const visiblePosts = filteredPosts.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [searchText]);

  const openProduct = (product) => {
    detailcart(product);
    navigate(product._id);
  };

  if (!isAuathenticated) return <Navigate to="/login" replace />;

  if (storeLoading) {
    return (
      <div className="dashboard-loading">
        <Spinner animation="border" role="status" />
        <span>Đang chuẩn bị cửa hàng cho bạn...</span>
      </div>
    );
  }

  return (
    <main className="pet-dashboard">
      <section className="dashboard-hero">
        <Carousel fade controls indicators interval={5500} pause="hover">
          <Carousel.Item>
            <img className="dashboard-hero-image" src={slider} alt="Thú cưng đáng yêu" />
            <Carousel.Caption className="dashboard-hero-caption">
              <span className="dashboard-eyebrow">PET HOUSE · YÊU THƯƠNG MỖI NGÀY</span>
              <h1>Tìm người bạn nhỏ<br />cho hành trình lớn</h1>
              <p>Những người bạn đáng yêu đang chờ được gặp bạn.</p>
              <a href="#san-pham" className="dashboard-hero-cta">Khám phá ngay <span>→</span></a>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="dashboard-hero-image" src={slider2} alt="Khoảnh khắc bên thú cưng" />
            <Carousel.Caption className="dashboard-hero-caption">
              <span className="dashboard-eyebrow">BẠN ĐỒNG HÀNH CỦA BẠN</span>
              <h1>Một mái nhà,<br />thêm nhiều yêu thương</h1>
              <p>Chọn người bạn phù hợp với trái tim và gia đình bạn.</p>
              <a href="#san-pham" className="dashboard-hero-cta">Xem các bé <span>→</span></a>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="dashboard-hero-image" src={slider3} alt="Thú cưng vui vẻ" />
            <Carousel.Caption className="dashboard-hero-caption">
              <span className="dashboard-eyebrow">HẠNH PHÚC TỪ ĐIỀU GIẢN DỊ</span>
              <h1>Thêm một thành viên,<br />thêm ngàn niềm vui</h1>
              <p>Bắt đầu câu chuyện đáng yêu của riêng bạn hôm nay.</p>
              <a href="#san-pham" className="dashboard-hero-cta">Tìm hiểu thêm <span>→</span></a>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      <section className="dashboard-benefits" aria-label="Cam kết PET HOUSE">
        <div><span className="benefit-icon">♡</span><div><strong>Yêu thương tận tâm</strong><small>Đặt sức khỏe thú cưng lên đầu</small></div></div>
        <div><span className="benefit-icon">✦</span><div><strong>Tư vấn chu đáo</strong><small>Giúp bạn chọn người bạn phù hợp</small></div></div>
        <div><span className="benefit-icon">✓</span><div><strong>Đồng hành lâu dài</strong><small>Sẵn sàng hỗ trợ sau khi đón bé</small></div></div>
      </section>

      <section className="dashboard-products" id="san-pham">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-kicker">GẶP GỠ NHỮNG NGƯỜI BẠN</span>
            <h2>Thành viên đáng yêu</h2>
            <p>Chọn một người bạn nhỏ để bắt đầu hành trình mới.</p>
          </div>
          <span className="dashboard-product-count">{filteredPosts.length} sản phẩm</span>
        </div>

        <div className="dashboard-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Tìm theo tên thú cưng..."
            aria-label="Tìm theo tên thú cưng"
          />
          {searchText && <button type="button" onClick={() => setSearchText("")}>Xóa</button>}
        </div>

        {visiblePosts.length > 0 ? (
          <Row className="g-4 dashboard-product-grid">
            {visiblePosts.map((product) => (
              <Col key={product._id} xs={6} sm={6} md={4} lg={3}>
                <Card
                  className="dashboard-product-card h-100"
                  role="button"
                  tabIndex={0}
                  onClick={() => openProduct(product)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProduct(product);
                    }
                  }}
                >
                  <div className="dashboard-product-image-wrap">
                    <Card.Img
                      variant="top"
                      src={PORT + product.img}
                      alt={product.title || "Thú cưng"}
                      onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                    />
                    <span className="dashboard-product-tag">PET HOUSE</span>
                  </div>
                  <Card.Body>
                    <Card.Title>{product.title || "Người bạn đáng yêu"}</Card.Title>
                    <Card.Text className="dashboard-product-status">
                      {product.status || "Sẵn sàng tìm gia đình mới"}
                    </Card.Text>
                    <div className="dashboard-product-bottom">
                      <strong>
                        {product.money == null
                          ? "Liên hệ"
                          : Number(product.money).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                      </strong>
                      <span aria-hidden="true">→</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="dashboard-empty">
            <span>⌕</span>
            <h3>Chưa tìm thấy sản phẩm phù hợp</h3>
            <p>Thử một tên khác hoặc xóa từ khóa để xem tất cả sản phẩm.</p>
            {searchText && <button type="button" onClick={() => setSearchText("")}>Xem tất cả sản phẩm</button>}
          </div>
        )}

        {pageCount > 1 && (
          <nav className="dashboard-pagination" aria-label="Phân trang sản phẩm">
            <button type="button" disabled={currentPage === 0} onClick={() => setCurrentPage((page) => page - 1)}>← Trước</button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                type="button"
                key={index}
                className={currentPage === index ? "active" : ""}
                aria-current={currentPage === index ? "page" : undefined}
                onClick={() => setCurrentPage(index)}
              >{index + 1}</button>
            ))}
            <button type="button" disabled={currentPage >= pageCount - 1} onClick={() => setCurrentPage((page) => page + 1)}>Sau →</button>
          </nav>
        )}
      </section>

      <section className="dashboard-location">
        <div className="dashboard-location-copy">
          <span className="dashboard-kicker">LUÔN Ở ĐÂY VÌ BẠN</span>
          <h2>Ghé thăm PET HOUSE</h2>
          <p>Chúng tôi luôn sẵn lòng tư vấn để bạn tìm được người bạn đồng hành phù hợp.</p>
          <Link to="/contact">Liên hệ với chúng tôi <span>→</span></Link>
        </div>
        <img src={map} alt="Bản đồ địa điểm PET HOUSE" />
      </section>

      <footer className="dashboard-footer">
        <div className="dashboard-footer-main">
          <div className="dashboard-footer-brand">
            <img src={logowebwite} alt="PET HOUSE" />
            <p>Trao yêu thương, nhận lại những điều kỳ diệu.</p>
          </div>
          <div>
            <h3>Hỗ trợ khách hàng</h3>
            <p>Tư vấn tận tâm</p>
            <p>Thông tin minh bạch</p>
            <p>Đồng hành chu đáo</p>
          </div>
          <div>
            <h3>Về PET HOUSE</h3>
            <p>Email: xhieu213@gmail.com</p>
            <p>Điện thoại: 0389998053</p>
            <p>Việt Nam</p>
          </div>
          <div className="dashboard-footer-cert">
            <h3>Chứng nhận</h3>
            <img src={logoauthentication} alt="Chứng nhận" />
          </div>
        </div>
        <div className="dashboard-footer-bottom">
          <span>© {new Date().getFullYear()} PET HOUSE. Chăm sóc thú cưng bằng cả trái tim.</span>
        </div>
      </footer>
    </main>
  );
};

export default Dashboard;
