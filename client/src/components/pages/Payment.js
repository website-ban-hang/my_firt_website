import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { StorageCartContext } from "../../contexts/storagecartContext";
import { PORT } from "../../constants";
import AlertMessage from "../../View/AlertMessage";

const Payment = () => {
  const navigate = useNavigate();
  const { listStorage = [], sendlistpayment, getStorageCart, storageLoading } = useContext(StorageCartContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const total = useMemo(() => listStorage.reduce((sum, item) => sum + Number(item.toltalmoney || 0), 30000), [listStorage]);
  const selectedAddress = addresses.find(item => item._id === selectedId);

  useEffect(() => {
    getStorageCart();
    axios.get(`${PORT}auth/addresses`)
      .then(response => {
        const saved = Array.isArray(response.data?.addresses) ? response.data.addresses : [];
        setAddresses(saved);
        const preferred = saved.find(item => item.isDefault) || saved[0];
        if (preferred) setSelectedId(preferred._id);
      })
      .catch(() => setAlert({ type: "danger", message: "Không thể tải sổ địa chỉ. Vui lòng tải lại trang." }))
      .finally(() => setLoadingAddresses(false));
  }, []);

  const submitOrder = async () => {
    if (!selectedAddress) {
      setAlert({ type: "danger", message: "Vui lòng thêm và chọn địa chỉ nhận hàng trong sổ địa chỉ." });
      return;
    }
    if (!listStorage.length) {
      setAlert({ type: "danger", message: "Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi đặt hàng." });
      return;
    }
    setSubmitting(true);
    setAlert(null);
    const result = await sendlistpayment(selectedAddress.address, selectedAddress.phone, selectedAddress.recipient);
    setSubmitting(false);
    if (result?.success === false) {
      setAlert({ type: "danger", message: result.message || "Không thể tạo đơn hàng. Vui lòng thử lại." });
      return;
    }
    navigate("/finishedoder");
  };

  if (submitting || !storageLoading || loadingAddresses) {
    return <div className="ha-route-loading"><Spinner animation="border" /><span>Đang chuẩn bị đơn hàng...</span></div>;
  }

  return (
    <main className="ha-checkout-page">
      <div className="ha-checkout-shell">
        <nav className="ha-checkout-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><Link to="/viewcart">Giỏ hàng</Link><span>/</span><b>Thanh toán</b></nav>
        <header className="ha-checkout-heading"><span>HOÀNG ÁNH ĐIỆN MÁY</span><h1>Hoàn tất đơn hàng</h1><p>Chọn địa chỉ đã lưu để chúng tôi giao hàng đến đúng nơi.</p></header>
        {alert && <AlertMessage info={alert} />}
        <div className="ha-checkout-layout">
          <section className="ha-checkout-address-panel">
            <div className="ha-checkout-panel-heading"><div><h2>Địa chỉ nhận hàng</h2><p>Chọn một địa chỉ và số điện thoại đã đăng ký</p></div><Link to="/account#addresses">+ Quản lý địa chỉ</Link></div>
            {addresses.length ? <div className="ha-saved-address-list">
              {addresses.map(item => <label className={`ha-saved-address ${selectedId === item._id ? "selected" : ""}`} key={item._id}>
                <input type="radio" name="shipping-address" value={item._id} checked={selectedId === item._id} onChange={() => setSelectedId(item._id)} />
                <span className="ha-address-radio" />
                <span className="ha-address-copy"><span className="ha-address-title">{item.label || "Địa chỉ"} {item.isDefault && <b>MẶC ĐỊNH</b>}</span><strong>{item.recipient} · {item.phone}</strong><small>{item.address}</small></span>
              </label>)}
            </div> : <div className="ha-no-address"><h3>Bạn chưa lưu địa chỉ giao hàng</h3><p>Thêm địa chỉ và số điện thoại trong tài khoản trước khi đặt hàng.</p><Link to="/account#addresses">Thêm địa chỉ nhận hàng</Link></div>}
            <div className="ha-checkout-help">Cần thay đổi địa chỉ? <Link to="/account#addresses">Cập nhật sổ địa chỉ</Link></div>
          </section>
          <aside className="ha-checkout-summary">
            <h2>Đơn hàng của bạn</h2>
            {listStorage.map((item, index) => <div className="ha-checkout-item" key={item._id || index}><div><strong>{item.title}</strong><small>Số lượng: {item.quantily}</small></div><b>{Number(item.toltalmoney || 0).toLocaleString("vi-VN")}₫</b></div>)}
            <div className="ha-checkout-fee"><span>Phí giao hàng tạm tính</span><b>30.000₫</b></div>
            <div className="ha-checkout-total"><span>Tổng thanh toán</span><strong>{total.toLocaleString("vi-VN")}₫</strong></div>
            <button type="button" disabled={!selectedAddress || !listStorage.length} onClick={submitOrder}>Xác nhận đặt hàng</button>
            <p>Đơn hàng sẽ được cửa hàng xác nhận và cập nhật trạng thái trong mục lịch sử đơn hàng.</p>
          </aside>
        </div>
      </div>
    </main>
  );
};
export default Payment;
