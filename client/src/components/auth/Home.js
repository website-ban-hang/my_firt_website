import React, { useContext, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { storeContext } from "../../contexts/StoreContext";
import { ListOderCOntext } from "../../contexts/ListoderContext";

const money = value => Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const orderTotal = order => Array.isArray(order?.listOder) ? order.listOder.reduce((sum, item) => sum + Number(item.toltalmoney || 0), 0) : 0;
const Home = () => {
  const { listpost = [], getListStore, storeLoading } = useContext(storeContext);
  const { listtheoder = [], getlsitcartoderadmin, loadingListoder } = useContext(ListOderCOntext);
  useEffect(() => { getListStore(); getlsitcartoderadmin(); }, []);
  const orders = Array.isArray(listtheoder) ? listtheoder : [];
  const products = Array.isArray(listpost) ? listpost : [];
  const completed = orders.filter(order => order.status === true);
  const pending = orders.filter(order => order.status !== true);
  const revenue = completed.reduce((sum, order) => sum + orderTotal(order), 0);
  const monthly = useMemo(() => {
    const labels = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
    const values = labels.map((_, month) => completed.filter(order => {
      const raw = String(order.createAt || "");
      const date = new Date(raw);
      return !Number.isNaN(date.getTime()) && date.getMonth() === month && date.getFullYear() === new Date().getFullYear();
    }).reduce((sum, order) => sum + orderTotal(order), 0));
    return values.map((value, index) => ({ label: labels[index], value }));
  }, [completed]);
  const maxRevenue = Math.max(1, ...monthly.map(item => item.value));
  const bestSellers = useMemo(() => {
    const map = {};
    completed.forEach(order => (order.listOder || []).forEach(item => {
      const key = item.title || item.name || item._id || "Sản phẩm";
      map[key] = (map[key] || 0) + Number(item.quantily || 0);
    }));
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,5);
  }, [completed]);
  if (storeLoading || loadingListoder) return <div className="ha-loading"><Spinner animation="border" /><span>Đang đồng bộ dữ liệu thực tế...</span></div>;
  return <div className="ha-dashboard">
    <div className="ha-page-heading"><div><div className="ha-eyebrow">TỔNG QUAN KINH DOANH</div><h1>Chào mừng trở lại!</h1><p>Theo dõi hoạt động cửa hàng HOÀNG ÁNH ĐIỆN MÁY trong một giao diện.</p></div><div className="ha-heading-actions"><span className="ha-date-chip">◷ {new Date().toLocaleDateString("vi-VN")}</span><Link to="/admin/additem" className="ha-primary-btn">＋ Thêm sản phẩm</Link></div></div>
    <div className="ha-stat-grid">
      <article className="ha-stat-card"><div className="ha-stat-top"><span>Doanh thu đã xác nhận</span><i className="ha-stat-icon orange">₫</i></div><strong>{money(revenue)}</strong><small>Tính từ đơn hàng đã xác nhận</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top"><span>Tổng đơn hàng</span><i className="ha-stat-icon blue">▣</i></div><strong>{orders.length}</strong><small>{pending.length} đơn đang chờ xử lý</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top"><span>Sản phẩm đang quản lý</span><i className="ha-stat-icon navy">▤</i></div><strong>{products.length}</strong><small>Dữ liệu từ kho sản phẩm hiện tại</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top"><span>Đơn đã xác nhận</span><i className="ha-stat-icon green">✓</i></div><strong>{completed.length}</strong><small>Đơn hàng được quản lý thành công</small></article>
    </div>
    <div className="ha-dashboard-grid">
      <section className="ha-panel ha-revenue-panel"><div className="ha-panel-heading"><div><h2>Doanh thu theo tháng</h2><p>Năm {new Date().getFullYear()} · Đơn đã xác nhận</p></div><span className="ha-panel-tag">DỮ LIỆU THỰC</span></div>
        <div className="ha-chart-total">{money(revenue)}</div><div className="ha-bar-chart">{monthly.map(item => <div className="ha-bar-column" key={item.label} title={item.label + ": " + money(item.value)}><div className="ha-bar-track"><div className="ha-bar-fill" style={{height: (item.value / maxRevenue * 100) + "%"}} /></div><small>{item.label}</small></div>)}</div>
      </section>
      <section className="ha-panel"><div className="ha-panel-heading"><div><h2>Tình trạng đơn hàng</h2><p>Tổng hợp theo trạng thái hiện tại</p></div></div><div className="ha-order-donut" style={{"--done": orders.length ? completed.length / orders.length * 100 : 0}}><div><strong>{orders.length}</strong><small>Tổng đơn</small></div></div><div className="ha-legend"><span><i className="done"></i>Đã xác nhận <b>{completed.length}</b></span><span><i className="waiting"></i>Chờ xử lý <b>{pending.length}</b></span></div></section>
    </div>
    <div className="ha-dashboard-grid ha-bottom-grid">
      <section className="ha-panel"><div className="ha-panel-heading"><div><h2>Đơn hàng gần đây</h2><p>Cập nhật từ hệ thống đặt hàng</p></div><Link to="/admin/listorders">Xem tất cả →</Link></div>
        {orders.length ? <div className="ha-order-list">{orders.slice().reverse().slice(0,6).map((order,index) => <div className="ha-order-row" key={order._id || index}><div className="ha-order-symbol">▣</div><div className="ha-order-info"><b>Đơn #{String(order._id || index + 1).slice(-7).toUpperCase()}</b><small>{order.tell || order.address || "Khách hàng"}</small></div><strong>{money(orderTotal(order))}</strong><span className={order.status ? "ha-status done" : "ha-status pending"}>{order.status ? "Đã xác nhận" : "Chờ xử lý"}</span></div>)}</div> : <div className="ha-empty">Chưa có đơn hàng trong hệ thống.</div>}
      </section>
      <section className="ha-panel"><div className="ha-panel-heading"><div><h2>Sản phẩm bán chạy</h2><p>Số lượng từ các đơn đã xác nhận</p></div><Link to="/admin/additem">Quản lý →</Link></div>
        {bestSellers.length ? <div className="ha-best-list">{bestSellers.map(([name,qty],index) => <div className="ha-best-row" key={name}><span className="ha-rank">{String(index+1).padStart(2,"0")}</span><div><b>{name}</b><small>Đã bán {qty}</small></div><strong>{qty}</strong></div>)}</div> : <div className="ha-empty">Chưa có dữ liệu sản phẩm bán ra từ đơn đã xác nhận.</div>}
      </section>
    </div>
    <div className="ha-data-note">Lưu ý: hệ thống hiện chưa có trường dữ liệu khách hàng riêng, giá vốn, tồn kho và trạng thái giao hàng chi tiết. Dashboard chỉ hiển thị số liệu có thật từ API hiện tại, không tạo dữ liệu mẫu.</div>
  </div>;
};
export default Home;
