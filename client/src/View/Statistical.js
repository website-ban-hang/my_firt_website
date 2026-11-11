import React, { useContext, useMemo, useState } from "react";
import { ListOderCOntext } from "../contexts/ListoderContext";

const formatMoney = value => Number(value || 0).toLocaleString("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0});
const Statistical = () => {
  const { listtheoder = [], loadingListoder } = useContext(ListOderCOntext);
  const orders = Array.isArray(listtheoder) ? listtheoder : [];
  const [year,setYear] = useState(String(new Date().getFullYear()));
  const [month,setMonth] = useState("all");
  const years = [...new Set(orders.map(order=>{const d=new Date(order.createAt);return Number.isNaN(d.getTime())?null:String(d.getFullYear())}).filter(Boolean))].sort().reverse();
  const filtered = useMemo(()=>orders.filter(order=>{const d=new Date(order.createAt);return !Number.isNaN(d.getTime()) && String(d.getFullYear())===year && (month==="all" || String(d.getMonth()+1)===month)}),[orders,year,month]);
  const completed = filtered.filter(order=>order.status===true);
  const total = order => (order.listOder || []).reduce((sum,item)=>sum+Number(item.toltalmoney||0),0);
  const revenue = completed.reduce((sum,order)=>sum+total(order),0);
  const months = Array.from({length:12},(_,i)=>({label:"T"+(i+1),value:completed.filter(order=>new Date(order.createAt).getMonth()===i).reduce((sum,order)=>sum+total(order),0)}));
  const max = Math.max(1,...months.map(item=>item.value));
  if(loadingListoder) return <div className="ha-loading">Đang tổng hợp báo cáo...</div>;
  return <div className="ha-reports">
    <div className="ha-page-heading"><div><div className="ha-eyebrow">BUSINESS INTELLIGENCE</div><h1>Báo cáo thống kê</h1><p>Phân tích doanh thu và đơn hàng theo dữ liệu ghi nhận.</p></div><span className="ha-date-chip">◷ Báo cáo trực tiếp</span></div>
    <section className="ha-panel ha-report-filters"><div><label>Năm thống kê</label><select value={year} onChange={e=>setYear(e.target.value)}>{(years.length?years:[String(new Date().getFullYear())]).map(y=><option key={y} value={y}>{y}</option>)}</select></div><div><label>Tháng</label><select value={month} onChange={e=>setMonth(e.target.value)}><option value="all">Tất cả tháng</option>{months.map((m,i)=><option key={i} value={String(i+1)}>Tháng {i+1}</option>)}</select></div></section>
    <div className="ha-stat-grid"><article className="ha-stat-card"><div className="ha-stat-top">Doanh thu đã xác nhận</div><strong>{formatMoney(revenue)}</strong><small>Trong khoảng thời gian đã chọn</small></article><article className="ha-stat-card"><div className="ha-stat-top">Tổng đơn hàng</div><strong>{filtered.length}</strong><small>Đơn hàng được ghi nhận</small></article><article className="ha-stat-card"><div className="ha-stat-top">Đơn đã xác nhận</div><strong>{completed.length}</strong><small>Đơn đã được xác nhận</small></article><article className="ha-stat-card"><div className="ha-stat-top">Đơn chờ xử lý</div><strong>{filtered.length-completed.length}</strong><small>Chưa được xác nhận</small></article></div>
    <section className="ha-panel"><div className="ha-panel-heading"><div><h2>Biểu đồ doanh thu theo tháng</h2><p>Năm {year} · Chỉ tính đơn đã xác nhận</p></div></div><div className="ha-report-chart">{months.map((m,i)=><div className="ha-report-bar-col" key={m.label}><strong>{m.value?formatMoney(m.value):""}</strong><div className="ha-report-track"><div style={{height:(m.value/max*100)+"%"}}/></div><small>{m.label}</small></div>)}</div></section>
    <section className="ha-panel mt-3"><div className="ha-panel-heading"><div><h2>Chi tiết đơn hàng</h2><p>{filtered.length} đơn phù hợp bộ lọc</p></div></div><div className="ha-product-table-wrap"><table className="ha-product-table"><thead><tr><th>THỜI GIAN</th><th>LIÊN HỆ</th><th>ĐỊA CHỈ</th><th>SẢN PHẨM</th><th>GIÁ TRỊ</th><th>TRẠNG THÁI</th></tr></thead><tbody>{filtered.slice().reverse().map((order,index)=><tr key={order._id||index}><td>{order.createAt || "—"}</td><td>{order.tell || "—"}</td><td>{order.address || "—"}</td><td>{order.listOder?.length || 0}</td><td><b>{formatMoney(total(order))}</b></td><td><span className={order.status?"ha-status done":"ha-status pending"}>{order.status?"Đã xác nhận":"Chờ xử lý"}</span></td></tr>)}</tbody></table></div>{!filtered.length&&<div className="ha-empty">Không có đơn hàng trong khoảng thời gian đã chọn.</div>}</section>
    <div className="ha-data-note">Báo cáo sử dụng ngày tạo, trạng thái xác nhận và tổng tiền sản phẩm mà API đơn hàng hiện cung cấp. Phương thức thanh toán, phí vận chuyển và lợi nhuận chưa được API trả về.</div>
  </div>;
};
export default Statistical;
