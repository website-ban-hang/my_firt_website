import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiPackage,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import { Authcontext } from "../../contexts/Authcontext";
import { storeContext } from "../../contexts/StoreContext";
import { PORT } from "../../constants";
import heroPet from "../../assets/thucung1.jpeg";
import "./Returnguest.css";

const PAGE_SIZE = 12;

const formatPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Liên hệ";
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
};

const getImageUrl = (image) => {
  if (!image) return heroPet;
  if (/^https?:\/\//i.test(image)) return image;
  return `${PORT}${String(image).replace(/^\/+/, "")}`;
};

const Returnguest = () => {
  const {
    authState: { isAuathenticated },
    checkuseradm,
  } = useContext(Authcontext);
  const { listpost, storeLoading } = useContext(storeContext);
  const navigate = useNavigate();
  const products = Array.isArray(listpost) ? listpost : [];
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");
    const result = products.filter((item) => {
      const title = String(item.title || "").toLocaleLowerCase("vi");
      const description = String(item.status || "").toLocaleLowerCase("vi");
      return !keyword || title.includes(keyword) || description.includes(keyword);
    });

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.money || 0) - Number(b.money || 0));
    } else if (sort === "price-high") {
      result.sort((a, b) => Number(b.money || 0) - Number(a.money || 0));
    } else if (sort === "name") {
      result.sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "vi"));
    }
    return result;
  }, [products, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  if (isAuathenticated && checkuseradm !== true) {
    return <Navigate to="/dashboard" replace />;
  }
  if (isAuathenticated && checkuseradm === true) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="guest-shop">
      <div className="guest-topline">
        <span>Yêu thương mỗi ngày, chăm sóc trọn từng khoảnh khắc</span>
        <span className="guest-topline-right"><FiTruck /> Giao hàng tiện lợi trên toàn quốc</span>
      </div>

      <header className="guest-header">
        <Link to="/returnguest" className="guest-brand" aria-label="Pet House - Trang chủ">
          <span className="guest-brand-mark"><FiHeart /></span>
          <span className="guest-brand-name">PET<span>HOUSE</span><small>YÊU THƯƠNG TỪ ĐIỀU NHỎ NHẤT</small></span>
        </Link>
        <nav className="guest-nav" aria-label="Điều hướng chính">
          <a className="active" href="#guest-home">Trang chủ</a>
          <a href="#guest-products">Sản phẩm</a>
          <a href="#guest-benefits">Về chúng tôi</a>
        </nav>
        <div className="guest-actions">
          <Link to="/login" className="guest-login"><FiUser /> Đăng nhập</Link>
          <Link to="/register" className="guest-register">Tạo tài khoản <FiArrowRight /></Link>
        </div>
      </header>

      <section className="guest-hero" id="guest-home">
        <div className="guest-hero-copy">
          <div className="guest-eyebrow"><span /> CỬA HÀNG DÀNH CHO BÉ CƯNG</div>
          <h1>Niềm vui của bé,<br /><em>hạnh phúc của bạn.</em></h1>
          <p>Khám phá những sản phẩm được chọn lựa để mỗi ngày bên người bạn nhỏ đều trọn vẹn và đầy yêu thương.</p>
          <div className="guest-hero-buttons">
            <a href="#guest-products" className="guest-primary-btn">Khám phá sản phẩm <FiArrowRight /></a>
            <Link to="/register" className="guest-text-btn">Tham gia cùng chúng tôi</Link>
          </div>
          <div className="guest-hero-note"><span className="guest-note-icon"><FiCheck /></span> Chọn lựa tận tâm · Mua sắm an tâm</div>
        </div>
        <div className="guest-hero-art">
          <div className="guest-art-orbit" />
          <img src={heroPet} alt="Người bạn thú cưng đáng yêu" />
          <div className="guest-art-sticker"><FiHeart /><span>Made with<br /><strong>LOVE</strong></span></div>
          <div className="guest-art-caption"><strong>Ở đây có điều dễ thương</strong><span>Dành riêng cho những người bạn đặc biệt</span></div>
        </div>
        <div className="guest-hero-decoration guest-decoration-one" />
        <div className="guest-hero-decoration guest-decoration-two" />
      </section>

      <section className="guest-benefits" id="guest-benefits">
        <div className="guest-benefit"><span><FiShield /></span><div><strong>Chọn lựa an tâm</strong><small>Thông tin sản phẩm rõ ràng</small></div></div>
        <div className="guest-benefit"><span><FiTruck /></span><div><strong>Giao hàng tiện lợi</strong><small>Đặt hàng nhanh chóng</small></div></div>
        <div className="guest-benefit"><span><FiHeart /></span><div><strong>Phục vụ bằng yêu thương</strong><small>Luôn đặt trải nghiệm lên đầu</small></div></div>
      </section>

      <section className="guest-products-section" id="guest-products">
        <div className="guest-section-heading">
          <div>
            <div className="guest-eyebrow"><span /> GÓC MUA SẮM</div>
            <h2>Sản phẩm dành cho bé</h2>
            <p>Tìm món đồ phù hợp để chăm sóc người bạn nhỏ mỗi ngày.</p>
          </div>
          <div className="guest-product-count"><strong>{products.length}</strong><span>sản phẩm<br />đang có</span></div>
        </div>

        <div className="guest-toolbar">
          <label className="guest-search">
            <FiSearch />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm sản phẩm bạn đang cần..."
              aria-label="Tìm sản phẩm"
            />
            {search && <button type="button" onClick={() => setSearch("")} aria-label="Xóa tìm kiếm">×</button>}
          </label>
          <label className="guest-sort-label">
            <span>Sắp xếp:</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sắp xếp sản phẩm">
              <option value="featured">Nổi bật</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="name">Tên sản phẩm</option>
            </select>
          </label>
        </div>

        {storeLoading ? (
          <div className="guest-empty-state guest-loading">
            <div className="guest-empty-icon"><FiPackage /></div>
            <h3>Đang chuẩn bị cửa hàng...</h3>
            <p>Chờ một chút nhé, chúng tôi đang tải danh sách sản phẩm.</p>
          </div>
        ) : visibleProducts.length > 0 ? (
          <>
            <div className="guest-product-grid">
              {visibleProducts.map((item, index) => (
                <article className="guest-product-card" key={item._id || item.id || `${item.title || "product"}-${index}`}>
                  <button type="button" className="guest-product-image" onClick={() => navigate("/login")} aria-label={`Xem ${item.title || "sản phẩm"}`}>
                    <img
                      src={getImageUrl(item.img)}
                      alt={item.title || "Sản phẩm"}
                      onError={(event) => { event.currentTarget.src = heroPet; }}
                    />
                    <span className="guest-image-badge">PET HOUSE</span>
                  </button>
                  <div className="guest-product-info">
                    <span className="guest-product-category">DÀNH CHO BÉ CƯNG</span>
                    <h3>{item.title || "Sản phẩm"}</h3>
                    <p>{item.status || "Món đồ nhỏ xinh cho người bạn đặc biệt."}</p>
                    <div className="guest-product-bottom">
                      <strong>{formatPrice(item.money)}</strong>
                      <button type="button" onClick={() => navigate("/login")} aria-label="Đăng nhập để mua hàng"><FiShoppingBag /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="guest-pagination">
                <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} aria-label="Trang trước"><FiChevronLeft /></button>
                <span>Trang <strong>{page}</strong> / {totalPages}</span>
                <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)} aria-label="Trang sau"><FiChevronRight /></button>
              </div>
            )}
          </>
        ) : (
          <div className="guest-empty-state">
            <div className="guest-empty-icon"><FiPackage /></div>
            <span className="guest-empty-kicker">{search ? "CHƯA TÌM THẤY KẾT QUẢ" : "CỬA HÀNG ĐANG CHUẨN BỊ"}</span>
            <h3>{search ? "Chưa tìm thấy sản phẩm phù hợp" : "Những điều dễ thương sắp xuất hiện!"}</h3>
            <p>{search ? "Thử một từ khóa khác hoặc xóa nội dung tìm kiếm để xem toàn bộ sản phẩm." : "Chúng tôi đang cập nhật những sản phẩm đầu tiên. Hãy quay lại sớm để khám phá nhé!"}</p>
            {search ? (
              <button type="button" className="guest-primary-btn" onClick={() => setSearch("")}>Xem tất cả sản phẩm <FiArrowRight /></button>
            ) : (
              <Link to="/register" className="guest-primary-btn">Đăng ký để cập nhật <FiArrowRight /></Link>
            )}
          </div>
        )}
      </section>

      <footer className="guest-footer">
        <Link to="/returnguest" className="guest-footer-brand"><span className="guest-brand-mark"><FiHeart /></span> PET HOUSE</Link>
        <span>Trao yêu thương, nhận lại niềm vui. © {new Date().getFullYear()} Pet House.</span>
        <div><Link to="/login">Đăng nhập</Link><Link to="/register">Đăng ký</Link></div>
      </footer>
    </main>
  );
};

export default Returnguest;
