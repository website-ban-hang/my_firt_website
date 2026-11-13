import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Authcontext } from "../../contexts/Authcontext";
import { PORT } from "../../constants";
import "./AccountPage.css";

const emptyForm = { label: "Nhà riêng", recipient: "", phone: "", address: "", isDefault: false };

export default function AccountPage() {
  const { authState: { user }, logoutUser, checkuseradm } = useContext(Authcontext);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${PORT}auth/addresses`);
      setAddresses(Array.isArray(response.data?.addresses) ? response.data.addresses : []);
    } catch (e) {
      setError(e.response?.data?.message || "Không thể tải sổ địa chỉ.");
    } finally { setLoading(false); }
  };
  useEffect(() => { loadAddresses(); }, []);

  const updateField = event => setForm(current => ({ ...current, [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  const addAddress = async event => {
    event.preventDefault();
    if (!form.recipient.trim() || !/^0[0-9]{9,10}$/.test(form.phone) || !form.address.trim()) {
      setError("Vui lòng nhập đủ tên người nhận, địa chỉ và số điện thoại hợp lệ (10–11 số).");
      return;
    }
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await axios.post(`${PORT}auth/addresses`, form);
      setAddresses(response.data.addresses || []);
      setForm(emptyForm);
      setNotice("Đã lưu địa chỉ giao hàng.");
    } catch (e) { setError(e.response?.data?.message || "Không thể lưu địa chỉ."); }
    finally { setSaving(false); }
  };
  const setDefault = async id => {
    try {
      const response = await axios.put(`${PORT}auth/addresses/${id}/default`);
      setAddresses(response.data.addresses || []);
      setNotice("Đã cập nhật địa chỉ mặc định.");
    } catch (e) { setError(e.response?.data?.message || "Không thể cập nhật địa chỉ."); }
  };
  const deleteAddress = async id => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    try {
      const response = await axios.delete(`${PORT}auth/addresses/${id}`);
      setAddresses(response.data.addresses || []);
      setNotice("Đã xóa địa chỉ.");
    } catch (e) { setError(e.response?.data?.message || "Không thể xóa địa chỉ."); }
  };
  const signOut = async () => { await logoutUser(); navigate("/", { replace: true }); };

  return (
    <main className="ha-account-page">
      <div className="ha-account-shell">
        <nav className="ha-account-breadcrumb"><Link to="/">Trang chủ</Link><span>/</span><b>Tài khoản</b></nav>
        <div className="ha-account-heading"><span>HOÀNG ÁNH ĐIỆN MÁY · KHU VỰC CÁ NHÂN</span><h1>Xin chào, {user?.username || "Khách hàng"}</h1><p>Quản lý thông tin tài khoản và các địa chỉ giao hàng của bạn.</p></div>
        <section className="ha-account-card">
          <div className="ha-account-avatar">{(user?.username || "U").slice(0,1).toUpperCase()}</div>
          <div className="ha-account-data"><small>TÊN ĐĂNG NHẬP</small><strong>{user?.username || "Chưa có thông tin"}</strong><small>VAI TRÒ</small><strong>{checkuseradm === true ? "Quản trị viên" : "Khách hàng"}</strong></div>
          <div className="ha-account-actions"><Link to="/cartoder">Lịch sử đơn hàng</Link><Link to="/viewcart">Giỏ hàng</Link><button type="button" onClick={signOut}>Đăng xuất</button></div>
        </section>

        <section className="ha-address-book" id="addresses">
          <div className="ha-address-book-heading"><div><span>DELIVERY PROFILE</span><h2>Sổ địa chỉ giao hàng</h2><p>Lưu nhiều địa chỉ, số điện thoại và chọn một địa chỉ mặc định để thanh toán nhanh.</p></div><span className="ha-address-count">{addresses.length} địa chỉ</span></div>
          {notice && <div className="ha-address-notice success" role="status">{notice}</div>}
          {error && <div className="ha-address-notice error" role="alert">{error}</div>}
          <div className="ha-address-book-grid">
            <div className="ha-address-list">
              {loading ? <p>Đang tải địa chỉ...</p> : addresses.length ? addresses.map(item => (
                <article className={`ha-address-card ${item.isDefault ? "is-default" : ""}`} key={item._id}>
                  <div className="ha-address-card-top"><span>{item.label || "Địa chỉ giao hàng"}</span>{item.isDefault && <b>ĐỊA CHỈ MẶC ĐỊNH</b>}</div>
                  <strong>{item.recipient}</strong><span>{item.phone}</span><p>{item.address}</p>
                  <div className="ha-address-card-actions">{!item.isDefault && <button type="button" onClick={() => setDefault(item._id)}>Đặt làm mặc định</button>}<button type="button" className="remove" onClick={() => deleteAddress(item._id)}>Xóa</button></div>
                </article>
              )) : <div className="ha-address-empty"><strong>Bạn chưa có địa chỉ nào</strong><p>Thêm địa chỉ bên cạnh để sử dụng khi đặt hàng.</p></div>}
            </div>
            <form className="ha-address-form" onSubmit={addAddress}>
              <h3>Thêm địa chỉ mới</h3>
              <label>Loại địa chỉ<select name="label" value={form.label} onChange={updateField}><option>Nhà riêng</option><option>Cơ quan</option><option>Khác</option></select></label>
              <label>Người nhận<input name="recipient" value={form.recipient} onChange={updateField} placeholder="Họ và tên người nhận" required /></label>
              <label>Số điện thoại<input name="phone" type="tel" maxLength="11" value={form.phone} onChange={updateField} placeholder="Ví dụ: 09xxxxxxxx" required /></label>
              <label>Địa chỉ chi tiết<textarea name="address" rows="3" value={form.address} onChange={updateField} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" required /></label>
              <label className="ha-address-default-check"><input type="checkbox" name="isDefault" checked={form.isDefault} onChange={updateField} /> Đặt làm địa chỉ mặc định</label>
              <button type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu địa chỉ"}</button>
            </form>
          </div>
        </section>
        <div className="ha-account-back"><Link to="/">← Quay lại cửa hàng</Link></div>
      </div>
    </main>
  );
}
