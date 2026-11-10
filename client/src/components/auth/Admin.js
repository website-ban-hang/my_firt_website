import React, { useContext, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { Authcontext } from "../../contexts/Authcontext";

const navGroups = [
  { label: "WORKSPACE", items: [
    { to: "/admin/homeadmin", label: "Tổng quan", icon: "▦" },
    { to: "/admin/additem", label: "Quản lý sản phẩm", icon: "▤" },
    { to: "/admin/listorders", label: "Quản lý đơn hàng", icon: "▣" },
    { to: "/admin/listmember", label: "Khách hàng & tài khoản", icon: "♙" },
    { to: "/admin/statistical", label: "Báo cáo thống kê", icon: "▥" }
  ]},
  { label: "MỞ RỘNG", items: [
    { label: "Danh mục sản phẩm", icon: "▧", disabled: true },
    { label: "Quản lý kho hàng", icon: "▦", disabled: true },
    { label: "Thư viện hình ảnh", icon: "▨", disabled: true },
    { label: "Khuyến mãi & đánh giá", icon: "☆", disabled: true },
    { label: "Cài đặt website", icon: "⚙", disabled: true }
  ]}
];

export default function Admin() {
  const { authState: { isAuathenticated, user }, checkuseradm, logoutUser } = useContext(Authcontext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  if (!isAuathenticated || checkuseradm !== true) return <Navigate to="/login" replace />;
  const activeTitle = navGroups.flatMap(group => group.items).find(item => item.to === location.pathname)?.label || "Trung tâm quản trị";
  return (
    <div className="ha-admin">
      <button className={`ha-sidebar-backdrop ${menuOpen ? "is-visible" : ""}`} aria-label="Đóng menu" onClick={() => setMenuOpen(false)} />
      <aside className={`ha-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="ha-brand">
          <div className="ha-brand-mark">HA<span>+</span></div>
          <div><strong>HOÀNG ÁNH</strong><small>ĐIỆN MÁY</small></div>
          <button className="ha-close-menu" onClick={() => setMenuOpen(false)} aria-label="Đóng menu">×</button>
        </div>
        <div className="ha-sidebar-caption">QUẢN TRỊ HỆ THỐNG</div>
        {navGroups.map(group => <div className="ha-nav-group" key={group.label}>
          <div className="ha-nav-label">{group.label}</div>
          {group.items.map(item => item.disabled
            ? <div className="ha-nav-item is-disabled" key={item.label} title="Chức năng cần bổ sung API/backend"><span className="ha-nav-icon">{item.icon}</span><span>{item.label}</span><small>—</small></div>
            : <NavLink onClick={() => setMenuOpen(false)} className={({isActive}) => `ha-nav-item ${isActive ? "is-active" : ""}`} to={item.to} key={item.to}><span className="ha-nav-icon">{item.icon}</span><span>{item.label}</span></NavLink>
          )}
        </div>)}
        <div className="ha-sidebar-bottom">
          <div className="ha-secure-note"><span>●</span><div><b>Phiên quản trị an toàn</b><small>Đã xác thực ADMIN</small></div></div>
          <button className="ha-logout" onClick={logoutUser}><span>↪</span> Đăng xuất</button>
        </div>
      </aside>
      <section className="ha-admin-main">
        <header className="ha-topbar">
          <button className="ha-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Mở menu">☰</button>
          <div className="ha-breadcrumb"><span>HOÀNG ÁNH ĐIỆN MÁY</span><b>/</b>{activeTitle}</div>
          <div className="ha-topbar-right"><span className="ha-live-dot"></span><span className="ha-online-label">Hệ thống hoạt động</span><div className="ha-avatar">{(user?.username || "A").slice(0,1).toUpperCase()}</div><div className="ha-user-meta"><b>{user?.username || "Quản trị viên"}</b><small>Administrator</small></div></div>
        </header>
        <main className="ha-page-content"><Outlet /></main>
        <footer className="ha-admin-footer">© {new Date().getFullYear()} HOÀNG ÁNH ĐIỆN MÁY <span>•</span> Hệ thống quản trị nội bộ</footer>
      </section>
    </div>
  );
}
