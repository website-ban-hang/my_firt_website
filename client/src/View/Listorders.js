import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { PORT } from "../constants";
import { ListOderCOntext } from "../contexts/ListoderContext";

const statusInfo = value => {
  if (value === "shipped") return { key: "shipped", label: "Đã vận chuyển", next: "delivered", nextLabel: "Xác nhận đã giao" };
  if (value === "delivered") return { key: "delivered", label: "Đã giao hàng", next: null };
  return { key: "processing", label: "Đang xử lý", next: "shipped", nextLabel: "Đánh dấu đã vận chuyển" };
};
const formatMoney = value => Number(value || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const total = order => (order.listOder || []).reduce((sum, item) => sum + Number(item.toltalmoney || 0), 0);

export default function Listorders() {
  const { listtheoder = [], getlsitcartoderadmin, loadingListoder } = useContext(ListOderCOntext);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState("");
  const [filter, setFilter] = useState("all");
  useEffect(() => { getlsitcartoderadmin(); }, []);
  const orders = Array.isArray(listtheoder) ? listtheoder : [];
  const normalized = value => value === true || value === false || !value ? "processing" : value;
  const counts = useMemo(() => ({
    processing: orders.filter(x => normalized(x.status) === "processing").length,
    shipped: orders.filter(x => normalized(x.status) === "shipped").length,
    delivered: orders.filter(x => normalized(x.status) === "delivered").length
  }), [orders]);
  const visible = orders.filter(order => filter === "all" || normalized(order.status) === filter);

  const updateStatus = async (order, nextStatus) => {
    const next = statusInfo(normalized(order.status));
    if (next.next !== nextStatus) return;
    const prompt = nextStatus === "shipped" ? "Xác nhận đơn hàng đã được bàn giao cho đơn vị vận chuyển?" : "Xác nhận khách hàng đã nhận được hàng?";
    if (!window.confirm(prompt)) return;
    setBusy(order._id);
    try {
      const response = await axios.put(`${PORT}theoder/${order._id}`, { status: nextStatus });
      if (response.data?.success) {
        if (selected?._id === order._id) setSelected({ ...selected, status: nextStatus });
        await getlsitcartoderadmin();
      }
    } catch (error) {
      window.alert(error.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng.");
    } finally { setBusy(""); }
  };

  const cancelOrder = async order => {
    if (!window.confirm("Bạn có chắc muốn hủy/xóa đơn hàng này? Thao tác này không thể hoàn tác.")) return;
    setBusy(order._id);
    try {
      await axios.delete(`${PORT}theoder/${order._id}`);
      setSelected(null);
      await getlsitcartoderadmin();
    } catch (error) { window.alert(error.response?.data?.message || "Không thể hủy đơn hàng."); }
    finally { setBusy(""); }
  };

  if (loadingListoder) return <div className="ha-loading"><Spinner animation="border" />Đang tải đơn hàng...</div>;
  return <div className="ha-orders-page">
    <div className="ha-page-heading"><div><div className="ha-eyebrow">ORDER MANAGEMENT</div><h1>Quản lý đơn hàng</h1><p>Theo dõi đơn mới và cập nhật tiến trình giao hàng theo từng bước.</p></div><span className="ha-date-chip">{orders.length} đơn hàng</span></div>
    <div className="ha-stat-grid ha-order-stats">
      <article className="ha-stat-card"><div className="ha-stat-top">Tổng đơn hàng</div><strong>{orders.length}</strong><small>Tất cả đơn trong hệ thống</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top">Đang xử lý</div><strong>{counts.processing}</strong><small>Đơn mới cần chuẩn bị</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top">Đã vận chuyển</div><strong>{counts.shipped}</strong><small>Đang trên đường giao</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top">Đã giao hàng</div><strong>{counts.delivered}</strong><small>Khách đã nhận hàng</small></article>
    </div>
    <section className="ha-panel">
      <div className="ha-panel-heading"><div><h2>Danh sách đơn hàng</h2><p>Cập nhật trạng thái tuần tự: Đang xử lý → Đã vận chuyển → Đã giao hàng</p></div>
        <select className="ha-filter-select" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Tất cả trạng thái</option><option value="processing">Đang xử lý</option><option value="shipped">Đã vận chuyển</option><option value="delivered">Đã giao hàng</option></select>
      </div>
      <div className="ha-product-table-wrap"><table className="ha-product-table ha-orders-table"><thead><tr><th>MÃ ĐƠN</th><th>KHÁCH HÀNG / ĐỊA CHỈ</th><th>SẢN PHẨM</th><th>TỔNG TIỀN</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead><tbody>
        {visible.map((order, index) => {
          const status = statusInfo(normalized(order.status));
          return <tr key={order._id || index}>
            <td><b>#{String(order._id || index + 1).slice(-8).toUpperCase()}</b><small className="ha-cell-muted">{order.createAt ? new Date(order.createAt).toLocaleString("vi-VN") : ""}</small></td>
            <td><b>{order.recipient || order.tell || "Khách hàng"}</b><small className="ha-cell-muted">{order.tell || ""}</small><small className="ha-cell-muted">{order.address || "Chưa có địa chỉ"}</small></td>
            <td>{order.listOder?.length || 0} mặt hàng</td><td><strong>{formatMoney(total(order))}</strong></td>
            <td><span className={`ha-status ${status.key}`}>{status.label}</span></td>
            <td><div className="ha-row-actions"><button onClick={() => setSelected(order)}>Chi tiết</button>{status.next && <button disabled={busy === order._id} onClick={() => updateStatus(order, status.next)}>{busy === order._id ? "Đang lưu..." : status.nextLabel}</button>}<button className="danger" disabled={busy === order._id} onClick={() => cancelOrder(order)}>Hủy</button></div></td>
          </tr>;
        })}
      </tbody></table></div>
      {!visible.length && <div className="ha-empty">Không có đơn hàng ở trạng thái này.</div>}
    </section>
    <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg"><Modal.Header closeButton><Modal.Title>Chi tiết đơn hàng</Modal.Title></Modal.Header><Modal.Body>
      {selected && <><div className="ha-order-detail-meta"><div><small>Mã đơn</small><b>#{String(selected._id).slice(-8).toUpperCase()}</b></div><div><small>Người nhận</small><b>{selected.recipient || "Chưa có"}</b></div><div><small>Số điện thoại</small><b>{selected.tell || "Chưa có"}</b></div><div><small>Địa chỉ giao hàng</small><b>{selected.address || "Chưa có"}</b></div><div><small>Ngày tạo</small><b>{selected.createAt ? new Date(selected.createAt).toLocaleString("vi-VN") : "Chưa có"}</b></div></div>
      <div className="ha-order-progress">{["processing", "shipped", "delivered"].map((key, index) => <div className={`ha-order-step ${["processing","shipped","delivered"].indexOf(normalized(selected.status)) >= index ? "active" : ""}`} key={key}><span>{index + 1}</span><b>{statusInfo(key).label}</b></div>)}</div>
      <h6 className="mt-4 mb-3">Sản phẩm trong đơn</h6>{(selected.listOder || []).map((item, index) => <div className="ha-detail-product" key={index}><div><b>{item.title || item.name || "Sản phẩm"}</b><small>Số lượng: {item.quantily || 0}</small></div><strong>{formatMoney(item.toltalmoney)}</strong></div>)}<div className="ha-detail-total"><span>Tổng cộng</span><b>{formatMoney(total(selected))}</b></div></>}
    </Modal.Body><Modal.Footer><Button variant="light" onClick={() => setSelected(null)}>Đóng</Button>{selected && statusInfo(normalized(selected.status)).next && <Button disabled={busy === selected._id} onClick={() => updateStatus(selected, statusInfo(normalized(selected.status)).next)}>{statusInfo(normalized(selected.status)).nextLabel}</Button>}</Modal.Footer></Modal>
  </div>;
}
