import React, { useContext, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Authcontext } from "../../contexts/Authcontext";

export default function Register() {
  const { authState: { isAuathenticated, authloading }, registerUser, checkuseradm } = useContext(Authcontext);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "", confirmpassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const from = location.state?.from?.pathname || location.state?.from || "/";

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.username.trim().length < 6) return setError("Tên đăng nhập cần có ít nhất 6 ký tự.");
    if (form.password.length < 6) return setError("Mật khẩu cần có ít nhất 6 ký tự.");
    if (form.password !== form.confirmpassword) return setError("Mật khẩu xác nhận không khớp.");
    setSubmitting(true);
    const result = await registerUser({ username: form.username.trim(), password: form.password });
    setSubmitting(false);
    if (!result?.success) return setError(result?.message || "Không thể tạo tài khoản. Vui lòng thử lại.");
    setSuccess("Tạo tài khoản thành công. Đang chuyển bạn về cửa hàng...");
    setTimeout(() => navigate(from, { replace: true }), 500);
  };

  if (authloading) return <div className="ha-route-loading"><Spinner animation="border" />Đang kiểm tra phiên đăng nhập...</div>;
  if (isAuathenticated) return <Navigate to={checkuseradm === true ? "/admin" : from} replace />;

  return (
    <main className="ha-auth-page">
      <section className="ha-auth-showcase">
        <Link to="/" className="ha-auth-brand"><span className="ha-auth-logo">HA<span>+</span></span><span><b>HOÀNG ÁNH</b><small>ĐIỆN MÁY</small></span></Link>
        <div className="ha-auth-showcase-copy">
          <span className="ha-auth-eyebrow">ĐỒNG HÀNH CÙNG HOÀNG ÁNH</span>
          <h1>Mua sắm thuận tiện.<br/><em>Kết nối dài lâu.</em></h1>
          <p>Tạo tài khoản để quản lý thông tin và theo dõi những đơn hàng của bạn.</p>
          <div className="ha-auth-points"><span>✓ Tài khoản cá nhân</span><span>✓ Theo dõi đơn hàng</span><span>✓ Hỗ trợ khi cần thiết</span></div>
        </div>
        <div className="ha-auth-decoration"><span>HA</span><i>⚡</i></div>
        <div className="ha-auth-showcase-foot">HOÀNG ÁNH ĐIỆN MÁY · THIẾT BỊ CHO MỌI NHÀ</div>
      </section>
      <section className="ha-auth-form-side">
        <div className="ha-auth-form-wrap">
          <Link to="/" className="ha-auth-back">← Quay về trang chủ</Link>
          <div className="ha-auth-heading"><span>BẮT ĐẦU CÙNG CHÚNG TÔI</span><h2>Tạo tài khoản mới</h2><p>Điền thông tin bên dưới để đăng ký.</p></div>
          {error && <div className="ha-auth-error" role="alert">{error}</div>}
          {success && <div className="ha-auth-success" role="status">{success}</div>}
          <form onSubmit={submit} className="ha-auth-form">
            <label htmlFor="register-username">Tên đăng nhập</label>
            <input id="register-username" autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="Ít nhất 6 ký tự" required minLength={6} />
            <label htmlFor="register-password">Mật khẩu</label>
            <div className="ha-auth-password"><input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Ít nhất 6 ký tự" required minLength={6} /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Ẩn" : "Hiện"}</button></div>
            <label htmlFor="register-confirm">Xác nhận mật khẩu</label>
            <input id="register-confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.confirmpassword} onChange={(event) => setForm({ ...form, confirmpassword: event.target.value })} placeholder="Nhập lại mật khẩu" required />
            <button className="ha-auth-submit" type="submit" disabled={submitting}>{submitting ? <><Spinner size="sm" animation="border" /> Đang tạo tài khoản...</> : "TẠO TÀI KHOẢN"}</button>
          </form>
          <div className="ha-auth-register">Đã có tài khoản? <Link to="/login" state={location.state}>Đăng nhập</Link></div>
          <div className="ha-auth-legal">Mật khẩu được xử lý và mã hóa tại backend hiện có; không lưu mật khẩu dạng văn bản trong giao diện.</div>
        </div>
      </section>
    </main>
  );
}
