import React, { useContext, useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { PORT } from "../constants";
import { StorageCartContext } from "../contexts/storagecartContext";
import "./viewcart.css";

const formatPrice = (value) => Number(value || 0).toLocaleString("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const imageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${PORT}${String(image).replace(/^\/+/, "")}`;
};

const Viewcart = () => {
  const {
    listStorage = [],
    increasequantily,
    loadingquanlyti,
    deletesoragecart2,
    getStorageCart,
    storageLoading,
  } = useContext(StorageCartContext);
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getStorageCart();
  }, []);

  const total = useMemo(
    () => listStorage.reduce((sum, item) => sum + Number(item.toltalmoney || 0), 0),
    [listStorage]
  );
  const itemCount = useMemo(
    () => listStorage.reduce((sum, item) => sum + Number(item.quantily || 0), 0),
    [listStorage]
  );

  const changeQuantity = async (item, delta) => {
    if (updatingId || deletingId) return;
    const nextQuantity = Number(item.quantily || 1) + delta;
    if (nextQuantity < 1) return;
    setUpdatingId(item._id);
    setNotice("");
    const result = await increasequantily(nextQuantity, item._id, item.money);
    setUpdatingId("");
    if (result?.success === false) {
      setNotice("Chưa thể cập nhật số lượng. Vui lòng thử lại.");
    }
  };

  const removeItem = async (id) => {
    if (updatingId || deletingId) return;
    setDeletingId(id);
    setNotice("");
    const result = await deletesoragecart2(id);
    setDeletingId("");
    if (result?.success === false) {
      setNotice("Chưa thể xóa sản phẩm. Vui lòng thử lại.");
    }
  };

  if (!storageLoading) {
    return (
      <main className="cart-page cart-page-loading">
        <Spinner animation="border" role="status" />
        <span>Đang tải giỏ hàng...</span>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-page-inner">
        <nav className="cart-breadcrumb" aria-label="Điều hướng">
          <Link to="/">Trang chủ</Link><span>/</span><span>Giỏ hàng</span>
        </nav>

        <header className="cart-heading">
          <div>
            <span className="cart-kicker">HOÀNG ÁNH ĐIỆN MÁY</span>
            <h1>Giỏ hàng của bạn</h1>
            <p>Kiểm tra sản phẩm và số lượng trước khi tiến hành đặt hàng.</p>
          </div>
          <Link className="cart-continue-link" to="/">← Tiếp tục mua sắm</Link>
        </header>

        {notice && <div className="cart-notice" role="alert">{notice}</div>}

        {listStorage.length === 0 ? (
          <section className="cart-empty">
            <div className="cart-empty-icon">🛍️</div>
            <h2>Giỏ hàng đang trống</h2>
            <p>Hãy khám phá cửa hàng và chọn những sản phẩm bạn cần nhé.</p>
            <Link to="/" className="cart-primary-button">Khám phá sản phẩm</Link>
          </section>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-panel" aria-label="Sản phẩm trong giỏ hàng">
              <div className="cart-items-title">
                <h2>Sản phẩm đã chọn</h2>
                <span>{listStorage.length} mặt hàng · {itemCount} sản phẩm</span>
              </div>

              <div className="cart-column-labels">
                <span>Sản phẩm</span><span>Đơn giá</span><span>Số lượng</span><span>Thành tiền</span>
              </div>

              {listStorage.map((item) => {
                const busy = updatingId === item._id || deletingId === item._id;
                return (
                  <article className={`cart-item ${busy ? "is-busy" : ""}`} key={item._id}>
                    <div className="cart-product-cell">
                      <div className="cart-image-frame">
                        {item.img ? (
                          <img src={imageUrl(item.img)} alt={item.title || "Sản phẩm"} loading="lazy" />
                        ) : <span className="cart-image-fallback">Ảnh sản phẩm</span>}
                      </div>
                      <div className="cart-product-copy">
                        <h3>{item.title || "Sản phẩm"}</h3>
                        <span className="cart-product-caption">Hoàng Ánh Điện Máy</span>
                        <button className="cart-remove-mobile" type="button" disabled={busy} onClick={() => removeItem(item._id)}>Xóa</button>
                      </div>
                    </div>
                    <div className="cart-unit-price">{formatPrice(item.money)}</div>
                    <div className="cart-quantity">
                      <button type="button" aria-label={`Giảm số lượng ${item.title || "sản phẩm"}`} disabled={busy || Number(item.quantily) <= 1} onClick={() => changeQuantity(item, -1)}>−</button>
                      <span aria-live="polite">{updatingId === item._id ? <Spinner animation="border" size="sm" /> : item.quantily}</span>
                      <button type="button" aria-label={`Tăng số lượng ${item.title || "sản phẩm"}`} disabled={busy} onClick={() => changeQuantity(item, 1)}>+</button>
                    </div>
                    <div className="cart-line-total">{formatPrice(item.toltalmoney)}</div>
                    <button className="cart-remove-desktop" type="button" disabled={busy} onClick={() => removeItem(item._id)} aria-label={`Xóa ${item.title || "sản phẩm"}`}>
                      {deletingId === item._id ? <Spinner animation="border" size="sm" /> : "×"}
                    </button>
                  </article>
                );
              })}
              <div className="cart-back-row"><Link to="/">← Tiếp tục chọn sản phẩm</Link></div>
            </section>

            <aside className="cart-summary">
              <h2>Tóm tắt đơn hàng</h2>
              <div className="cart-summary-row"><span>Tạm tính ({itemCount} sản phẩm)</span><strong>{formatPrice(total)}</strong></div>
              <div className="cart-summary-row"><span>Phí vận chuyển</span><span className="cart-shipping-note">Tính khi xác nhận</span></div>
              <div className="cart-summary-total"><span>Tổng cộng</span><strong>{formatPrice(total)}</strong></div>
              <button className="cart-primary-button cart-checkout-button" type="button" disabled={Boolean(updatingId || deletingId)} onClick={() => navigate("/payment")}>
                Tiến hành thanh toán <span>→</span>
              </button>
              <div className="cart-safe-note">✓ Thông tin đơn hàng được xác nhận trước khi đặt</div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Viewcart;
