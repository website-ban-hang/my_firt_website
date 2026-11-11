import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Authcontext } from "../../../contexts/Authcontext";
import { storeContext } from "../../../contexts/StoreContext";
import { StorageCartContext } from "../../../contexts/storagecartContext";
import { PORT } from "../../../constants";

const imageUrl = (value) => {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : PORT + String(value).replace(/^\/+/, "");
};
const money = (value) => Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export default function Detailcrat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState: { isAuathenticated } } = useContext(Authcontext);
  const { listpost = [], storeLoading, getlistCartreturnguest } = useContext(storeContext);
  const { addstorageCart } = useContext(StorageCartContext);
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const product = useMemo(() => (Array.isArray(listpost) ? listpost : []).find((item) => String(item._id || item.id) === String(id)), [listpost, id]);

  useEffect(() => {
    if (!product && !storeLoading) getlistCartreturnguest();
  }, [product, storeLoading, getlistCartreturnguest]);

  const addToCart = async () => {
    if (!isAuathenticated) {
      navigate("/login", { state: { from: { pathname: "/products/" + id } } });
      return;
    }
    if (!product) return;
    setSaving(true);
    const result = await addstorageCart(product, quantity, "Quảng Nam");
    setSaving(false);
    if (result && result.success !== false) setMessage("Đã thêm sản phẩm vào giỏ hàng.");
    else setMessage(result?.message || "Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
  };

  if (storeLoading && !product) return <div className="ha-route-loading"><Spinner animation="border" />Đang tải thông tin sản phẩm...</div>;
  if (!product) return <main className="ha-product-detail"><div className="ha-detail-empty"><h1>Không tìm thấy sản phẩm</h1><p>Sản phẩm có thể đã được gỡ khỏi cửa hàng hoặc đường dẫn không chính xác.</p><Link to="/">Quay về trang chủ</Link></div></main>;

  return (
    <main className="ha-product-detail">
      <div className="ha-detail-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>{product.title}</span></div>
      <section className="ha-detail-card">
        <div className="ha-detail-image"><img src={imageUrl(product.img)} alt={product.title} onError={(event) => { event.currentTarget.style.opacity = 0; }} /></div>
        <div className="ha-detail-info">
          <span className="ha-detail-eyebrow">HOÀNG ÁNH ĐIỆN MÁY · THIẾT BỊ CHÍNH HÃNG</span>
          <h1>{product.title}</h1>
          <div className="ha-detail-price">{money(product.money)}</div>
          <p className="ha-detail-description">{product.status || "Thông tin chi tiết sản phẩm đang được cập nhật."}</p>
          <div className="ha-detail-quantity"><label htmlFor="product-quantity">Số lượng</label><div><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Giảm số lượng">−</button><input id="product-quantity" type="number" min="1" max="50" value={quantity} onChange={(event) => setQuantity(Math.min(50, Math.max(1, Number(event.target.value) || 1)))} /><button type="button" onClick={() => setQuantity((value) => Math.min(50, value + 1))} aria-label="Tăng số lượng">＋</button></div></div>
          <div className="ha-detail-total">Tạm tính <strong>{money(Number(product.money || 0) * quantity)}</strong></div>
          <button className="ha-detail-add" type="button" disabled={saving} onClick={addToCart}>{saving ? "Đang thêm..." : isAuathenticated ? "Thêm vào giỏ hàng" : "Đăng nhập để thêm vào giỏ"}</button>
          {message && <p className="ha-detail-message" role="status">{message}</p>}
          {!isAuathenticated && <p className="ha-detail-note">Bạn có thể xem sản phẩm mà không cần tài khoản. Hệ thống giỏ hàng và đặt đơn hiện yêu cầu đăng nhập.</p>}
          <Link className="ha-detail-back" to="/">← Tiếp tục xem sản phẩm</Link>
        </div>
      </section>
    </main>
  );
}
