import React, { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Authcontext } from "../../contexts/Authcontext";
import { StorageCartContext } from "../../contexts/storagecartContext";
import { storeContext } from "../../contexts/StoreContext";

export default function LoginForm() {
  const { authState: { isAuathenticated, authloading }, loginUer, checkuseradm } = useContext(Authcontext);
  const { getStorageCart } = useContext(StorageCartContext);
  const { getListStore } = useContext(storeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const from = location.state?.from?.pathname || location.state?.from || "/";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await loginUer(form);
    setSubmitting(false);
    if (!result?.success) {
      setError(result?.message || "Thông tin đăng nhập chưa chính xác. Vui lòng thử lại.");
      return;
    }
    await Promise.all([getStorageCart(), getListStore()]);
    navigate(result.user?.admin === true || checkuseradm === true ? "/admin" : from, { replace: true });
  };

  if (authloading) return <div className="ha-route-loading"><Spinner animation="border" />Đang kiểm tra phiên đăng nhập...</div>;
  if (isAuathenticated) return <Navigate to={checkuseradm === true ? "/admin" : from} replace />;

  return (
    <main className="ha-auth-page">
      <section className="ha-auth-showcase">
        <Link to="/" className="ha-auth-brand"><span className="ha-auth-logo">HA<span>+</span></span><span><b>HOÀNG ÁNH</b><small>ĐIỆN MÁY</small></span></Link>
        <div className="ha-auth-showcase-copy">
          <span className="ha-auth-eyebrow">GIẢI PHÁP ĐIỆN & NƯỚC CHO MỌI NHÀ</span>
          <h1>Chọn đúng thiết bị.<br/><em>An tâm mỗi ngày.</em></h1>
          <p>Đăng nhập để quản lý đơn hàng, lưu thông tin mua sắm và tiếp tục hành trình cùng Hoàng Ánh Điện Máy.</p>
          <div className="ha-auth-points"><span>✓ Thông tin sản phẩm rõ ràng</span><span>✓ Theo dõi đơn hàng thuận tiện</span><span>✓ Hỗ trợ khách hàng tận tâm</span></div>
        </div>
        <div className="ha-auth-decoration"><span>HA</span><i>⚡</i></div>
        <div className="ha-auth-showcase-foot">HOÀNG ÁNH ĐIỆN MÁY · THIẾT BỊ CHO MỌI NHÀ</div>
      </section>
      <section className="ha-auth-form-side">
        <div className="ha-auth-form-wrap">
          <Link to="/" className="ha-auth-back">← Quay về trang chủ</Link>
          <div className="ha-auth-heading"><span>CHÀO MỪNG BẠN TRỞ LẠI</span><h2>Đăng nhập tài khoản</h2><p>Nhập thông tin tài khoản để tiếp tục.</p></div>
          {error && <div className="ha-auth-error" role="alert">{error}</div>}
          <form onSubmit={submit} className="ha-auth-form">
            <label htmlFor="login-username">Tên đăng nhập</label>
            <input id="login-username" name="username" autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Nhập tên đăng nhập" required />
            <label htmlFor="login-password">Mật khẩu</label>
            <div className="ha-auth-password"><input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Nhập mật khẩu" required /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Ẩn" : "Hiện"}</button></div>
            <div className="ha-auth-options"><span>Đăng nhập bảo mật</span><span className="ha-auth-muted">Quên mật khẩu? Liên hệ cửa hàng để được hỗ trợ.</span></div>
            <button className="ha-auth-submit" type="submit" disabled={submitting}>{submitting ? <><Spinner size="sm" animation="border" /> Đang đăng nhập...</> : "ĐĂNG NHẬP"}</button>
          </form>
          <div className="ha-auth-register">Chưa có tài khoản? <Link to="/register" state={location.state}>Đăng ký ngay</Link></div>
          <div className="ha-auth-legal">Bằng việc đăng nhập, bạn đồng ý sử dụng tài khoản theo chính sách của cửa hàng.</div>
        </div>
      </section>
    </main>
  );
}
