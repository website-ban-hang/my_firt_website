import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FiShoppingCart } from "react-icons/fi";
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
  const { getlistCartreturnguest } = useContext(storeContext);
  const { addstorageCart, listStorage = [], getStorageCart } = useContext(StorageCartContext);
  const cartCount = listStorage.reduce((total, item) => total + Math.max(0, Number(item.quantily) || 1), 0);
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const stockTracked = product?.stock !== undefined && product?.stock !== null && Number.isFinite(Number(product.stock));
  const stock = stockTracked ? Math.max(0, Number(product.stock)) : null;
  const maxPurchase = stockTracked ? Math.min(50, stock) : 50;

  useEffect(() => {
    if (isAuathenticated) getStorageCart();
  }, [isAuathenticated]);

  useEffect(() => {
    let active = true;
    setLoadingProduct(true);
    setLoadError("");
    setProduct(null);
    axios.get(`${PORT}store/detailcartguest/${id}`)
      .then((response) => {
        const detail = response.data?.detail;
        const found = Array.isArray(detail) ? detail[0] : detail;
        if (active && found) setProduct(found);
        else if (active) setLoadError("Không tìm thấy sản phẩm.");
      })
      .catch((error) => {
        if (active) setLoadError(error.response?.data?.message || "Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
      })
      .finally(() => { if (active) setLoadingProduct(false); });
    return () => { active = false; };
  }, [id]);

  const animateProductToCart = () => {
    const source = document.querySelector(".ha-detail-image img");
    const target = document.querySelector(".ha-detail-cart-link");
    if (!source || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const flying = source.cloneNode(true);
    Object.assign(flying.style, {
      position: "fixed", zIndex: "99999", left: from.left + "px", top: from.top + "px",
      width: Math.min(from.width, 150) + "px", height: Math.min(from.height, 150) + "px",
      objectFit: "contain", padding: "8px", borderRadius: "16px", background: "#fff",
      boxShadow: "0 12px 35px rgba(5,45,72,.24)", pointerEvents: "none", margin: "0"
    });
    document.body.appendChild(flying);
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const animation = flying.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1, borderRadius: "16px" },
      { transform: "translate(" + (dx * .55) + "px," + (dy * .55 - 70) + "px) scale(.55)", opacity: .95, offset: .65 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(.08)", opacity: 0, borderRadius: "50%" }
    ], { duration: 780, easing: "cubic-bezier(.2,.75,.25,1)" });
    animation.onfinish = () => flying.remove();
    target.animate([{ transform: "scale(1)" }, { transform: "scale(1.16)" }, { transform: "scale(1)" }], { duration: 380 });
  };

  const addToCart = async () => {
    if (!isAuathenticated) {
      navigate("/login", { state: { from: { pathname: "/products/" + id } } });
      return;
    }
    if (!product) return;
    if (stockTracked && stock === 0) { setMessage("Sản phẩm hiện đã hết hàng."); return; }
    if (stockTracked && quantity > stock) { setMessage(`Kho chỉ còn ${stock} sản phẩm.`); return; }
    setSaving(true);
    const result = await addstorageCart(product, quantity, "");
    setSaving(false);
    if (result && result.success !== false) { setMessage("Đã thêm sản phẩm vào giỏ hàng."); animateProductToCart(); }
    else setMessage(result?.message || "Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
  };

  if (loadingProduct) return <div className="ha-route-loading"><Spinner animation="border" />Đang tải thông tin sản phẩm...</div>;
  if (!product) return <main className="ha-product-detail"><div className="ha-detail-empty"><h1>Không tải được sản phẩm</h1><p>{loadError || "Sản phẩm có thể đã được gỡ khỏi cửa hàng hoặc đường dẫn không chính xác."}</p><Link to="/">Quay về trang chủ</Link></div></main>;

  return (
    <main className="ha-product-detail">
      <Link to={isAuathenticated ? "/viewcart" : "/login"} className="ha-detail-cart-link" aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}>
        <FiShoppingCart aria-hidden="true" />
        <span>Giỏ hàng</span>
        <strong>{cartCount}</strong>
      </Link>
      <div className="ha-detail-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><span>{product.title}</span></div>
      <section className="ha-detail-card">
        <div className="ha-detail-image"><img src={imageUrl(product.img)} alt={product.title} onError={(event) => { event.currentTarget.style.opacity = 0; }} /></div>
        <div className="ha-detail-info">
          <span className="ha-detail-eyebrow">HOÀNG ÁNH ĐIỆN MÁY · THIẾT BỊ ĐIỆN VÀ MÁY BƠM</span>
          <h1>{product.title}</h1>
          <div className="ha-detail-price">{money(product.money)}</div>
          <div className={`ha-detail-stock ${stockTracked && stock === 0 ? "out" : ""}`}><span className="ha-stock-dot" /><strong>Tồn kho:</strong><span>{stockTracked ? (stock > 0 ? `${stock} sản phẩm` : "Tạm hết hàng") : "Chưa cập nhật"}</span></div>
          <p className="ha-detail-description">{product.status || "Thông tin chi tiết sản phẩm đang được cập nhật."}</p>
          <div className="ha-detail-quantity"><label htmlFor="product-quantity">Số lượng mua</label><div className="ha-quantity-control"><button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Giảm số lượng">−</button><input id="product-quantity" type="number" min="1" max={maxPurchase || 1} value={quantity} onChange={(event) => setQuantity(Math.min(maxPurchase || 1, Math.max(1, Number(event.target.value) || 1)))} /><button type="button" disabled={stockTracked && quantity >= maxPurchase} onClick={() => setQuantity((value) => Math.min(maxPurchase || 1, value + 1))} aria-label="Tăng số lượng">＋</button></div></div>
          <div className="ha-detail-total">Tạm tính <strong>{money(Number(product.money || 0) * quantity)}</strong></div>
          <button className="ha-detail-add" type="button" disabled={saving || (stockTracked && stock === 0)} onClick={addToCart}>{saving ? "Đang thêm..." : stockTracked && stock === 0 ? "Tạm hết hàng" : isAuathenticated ? "Thêm vào giỏ hàng" : "Đăng nhập để thêm vào giỏ"}</button>
          {message && <p className="ha-detail-message" role="status">{message}</p>}
          {!isAuathenticated && <p className="ha-detail-note">Bạn có thể xem sản phẩm mà không cần tài khoản. Hệ thống giỏ hàng và đặt đơn hiện yêu cầu đăng nhập.</p>}
          <Link className="ha-detail-back" to="/">← Tiếp tục xem sản phẩm</Link>
        </div>
      </section>
    </main>
  );
}
