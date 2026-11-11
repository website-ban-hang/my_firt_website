import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Authcontext } from "../../contexts/Authcontext";

export default function AccountPage() {
  const { authState: { user }, logoutUser, checkuseradm } = useContext(Authcontext);
  const navigate = useNavigate();
  const signOut = async () => {
    await logoutUser();
    navigate("/", { replace: true });
  };
  return (
    <main className="ha-account-page">
      <div className="ha-account-shell">
        <div className="ha-account-heading"><span>TÀI KHOẢN CỦA BẠN</span><h1>Xin chào, {user?.username || "Khách hàng"}</h1><p>Thông tin được tải từ phiên đăng nhập hiện tại.</p></div>
        <section className="ha-account-card">
          <div className="ha-account-avatar">{(user?.username || "U").slice(0,1).toUpperCase()}</div>
          <div className="ha-account-data"><small>TÊN ĐĂNG NHẬP</small><strong>{user?.username || "Chưa có thông tin"}</strong><small>VAI TRÒ</small><strong>{checkuseradm === true ? "Quản trị viên" : "Khách hàng"}</strong><p>Thông tin cá nhân hiện đang ở chế độ xem. Backend chưa cung cấp API chỉnh sửa hồ sơ hoặc đổi mật khẩu.</p></div>
        </section>
        <div className="ha-account-actions"><Link to="/cartoder">Xem lịch sử đơn hàng</Link><Link to="/viewcart">Mở giỏ hàng</Link><Link to="/">Tiếp tục mua sắm</Link><button type="button" onClick={signOut}>Đăng xuất</button></div>
      </div>
    </main>
  );
}
