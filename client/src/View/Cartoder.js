import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import brandLogo from "../assets/logo.svg";
import { PORT } from "../constants";
import { ListOderCOntext } from "../contexts/ListoderContext";
import "./Cartoder.css";

const statusKey = value => value === "shipped" || value === "delivered" ? value : "processing";
const statusLabel = value => ({ processing: "Đang xử lý", shipped: "Đã vận chuyển", delivered: "Đã giao hàng" }[statusKey(value)]);
const money = value => Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

export default function Cartoder() {
  const [selected, setSelected] = useState(null);
  const { listtheoder = [], getlsitcartoder, loadingListoder } = useContext(ListOderCOntext);
  const orders = Array.isArray(listtheoder) ? listtheoder : [];
  useEffect(() => { getlsitcartoder(); }, []);

  const cancelOrder = async order => {
    if (!window.confirm("Bạn muốn hủy đơn hàng đang xử lý này?")) return;
    try {
      await axios.delete(`${PORT}theoder/${order._id}`);
      setSelected(null);
      getlsitcartoder();
    } catch (error) {
      window.alert(error.response?.data?.message || "Không thể hủy đơn hàng.");
    }
  };

  return <main className="cartoder-page cartoder-modern">
    <header className="cartoder-header"><Link to="/" className="cartoder-brand"><img src={brandLogo} alt="" /><span>HOÀNG ÁNH <strong>ĐIỆN MÁY</strong></span></Link><Link to="/" className="cartoder-home-link">⌂ Trang chủ</Link></header>
    <div className="cartoder-content">
      <div className="cartoder-title"><span>HOÀNG ÁNH ĐIỆN MÁY · TÀI KHOẢN</span><h1>Đơn hàng của tôi</h1><p>Theo dõi tình trạng xử lý và giao hàng cho từng đơn.</p></div>
      {loadingListoder ? <div className="cartoder-loading"><Spinner animation="border" variant="info" /></div> : orders.length ? <div className="cartoder-order-list">
        {orders.map(order => {
          const status = statusKey(order.status);
          const index = ["processing","shipped","delivered"].indexOf(status);
          const sum = (order.listOder || []).reduce((total, item) => total + Number(item.toltalmoney || 0), 0);
          return <article className="cartoder-order-card" key={order._id}>
            <div className="cartoder-order-top"><div><small>MÃ ĐƠN HÀNG</small><strong>#{String(order._id).slice(-8).toUpperCase()}</strong></div><span className={"cartoder-status " + status}>{statusLabel(status)}</span></div>
            <div className="cartoder-order-info"><span>{order.recipient || "Người nhận"}</span><span>{order.tell || ""}</span><span>{order.address || "Chưa có địa chỉ"}</span><span>{(order.listOder || []).length} sản phẩm · {money(sum)}</span></div>
            <div className="cartoder-tracking">{["Đang xử lý","Đã vận chuyển","Đã giao hàng"].map((label, step) => <div className={step <= index ? "active" : ""} key={label}><i>{step + 1}</i><b>{label}</b></div>)}</div>
            <div className="cartoder-order-actions"><button type="button" onClick={() => setSelected(order)}>Xem chi tiết</button>{status === "processing" && <button type="button" className="cancel" onClick={() => cancelOrder(order)}>Hủy đơn hàng</button>}</div>
          </article>;
        })}
      </div> : <div className="cartoder-empty"><h2>Bạn chưa có đơn hàng nào</h2><p>Những đơn hàng bạn đặt sẽ xuất hiện tại đây.</p><Link to="/">Khám phá sản phẩm</Link></div>}
    </div>
    {selected && <div className="cartoder-modal-backdrop" onClick={() => setSelected(null)}><section className="cartoder-detail-modal" onClick={event => event.stopPropagation()}><button className="cartoder-modal-close" onClick={() => setSelected(null)}>×</button><h2>Chi tiết đơn hàng</h2><p>Người nhận: <b>{selected.recipient || "—"}</b></p><p>Số điện thoại: <b>{selected.tell || "—"}</b></p><p>Địa chỉ: <b>{selected.address || "—"}</b></p><div className="cartoder-detail-items">{(selected.listOder || []).map((item,index) => <div key={index}><span>{item.title} × {item.quantily}</span><b>{money(item.toltalmoney)}</b></div>)}</div><strong className="cartoder-detail-total">Tổng tiền hàng: {money((selected.listOder || []).reduce((sum,item)=>sum+Number(item.toltalmoney || 0),0))}</strong></section></div>}
  </main>;
}
