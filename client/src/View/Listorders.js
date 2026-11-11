import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { PORT } from "../constants";
import { ListOderCOntext } from "../contexts/ListoderContext";

const formatMoney = value => Number(value || 0).toLocaleString("vi-VN", {style:"currency",currency:"VND",maximumFractionDigits:0});
const Listorders = () => {
  const { listtheoder = [], getlsitcartoderadmin, loadingListoder } = useContext(ListOderCOntext);
  const [selected,setSelected] = useState(null);
  const [busy,setBusy] = useState("");
  const [filter,setFilter] = useState("all");
  useEffect(()=>{getlsitcartoderadmin();},[]);
  const orders = Array.isArray(listtheoder) ? listtheoder : [];
  const visible = orders.filter(order => filter === "all" || (filter === "pending" ? order.status !== true : order.status === true));
  const total = order => (order.listOder || []).reduce((sum,item)=>sum+Number(item.toltalmoney || 0),0);
  const confirmOrder = async order => {
    if(!window.confirm("Xác nhận đơn hàng này?")) return;
    setBusy(order._id);
    try { await axios.put(`${PORT}theoder/${order._id}`,{status:true}); await getlsitcartoderadmin(); }
    catch(error){ window.alert(error.response?.data?.message || "Không thể xác nhận đơn hàng."); }
    finally{setBusy("");}
  };
  const cancelOrder = async order => {
    if(!window.confirm("Bạn có chắc muốn hủy/xóa đơn hàng này? Thao tác này không thể hoàn tác.")) return;
    setBusy(order._id);
    try { await axios.delete(`${PORT}theoder/${order._id}`); setSelected(null); await getlsitcartoderadmin(); }
    catch(error){ window.alert(error.response?.data?.message || "Không thể hủy đơn hàng."); }
    finally{setBusy("");}
  };
  if(loadingListoder) return <div className="ha-loading"><Spinner animation="border"/>Đang tải đơn hàng...</div>;
  return <div className="ha-orders-page">
    <div className="ha-page-heading"><div><div className="ha-eyebrow">ORDER MANAGEMENT</div><h1>Quản lý đơn hàng</h1><p>Theo dõi, xem chi tiết và xác nhận đơn hàng từ khách hàng.</p></div><span className="ha-date-chip">{orders.length} đơn hàng</span></div>
    <div className="ha-stat-grid ha-order-stats">
      <article className="ha-stat-card"><div className="ha-stat-top">Tất cả đơn hàng</div><strong>{orders.length}</strong><small>Đơn hàng trong hệ thống</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top">Chờ xử lý</div><strong>{orders.filter(x=>x.status!==true).length}</strong><small>Cần được xác nhận</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top">Đã xác nhận</div><strong>{orders.filter(x=>x.status===true).length}</strong><small>Đã được cửa hàng xác nhận</small></article>
      <article className="ha-stat-card"><div className="ha-stat-top">Doanh thu xác nhận</div><strong>{formatMoney(orders.filter(x=>x.status===true).reduce((sum,x)=>sum+total(x),0))}</strong><small>Tính trên đơn đã xác nhận</small></article>
    </div>
    <section className="ha-panel"><div className="ha-panel-heading"><div><h2>Danh sách đơn hàng</h2><p>Thông tin lấy trực tiếp từ API đơn hàng</p></div><select className="ha-filter-select" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Tất cả trạng thái</option><option value="pending">Chờ xử lý</option><option value="done">Đã xác nhận</option></select></div>
      <div className="ha-product-table-wrap"><table className="ha-product-table ha-orders-table"><thead><tr><th>MÃ ĐƠN</th><th>KHÁCH HÀNG / ĐỊA CHỈ</th><th>SẢN PHẨM</th><th>TỔNG TIỀN</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead><tbody>
        {visible.slice().reverse().map((order,index)=><tr key={order._id || index}><td><b>#{String(order._id || index+1).slice(-8).toUpperCase()}</b><small className="ha-cell-muted">{order.createAt || ""}</small></td><td><b>{order.tell || "Chưa có tên"}</b><small className="ha-cell-muted">{order.address || "Chưa có địa chỉ"}</small></td><td>{order.listOder?.length || 0} mặt hàng</td><td><strong>{formatMoney(total(order))}</strong></td><td><span className={order.status ? "ha-status done" : "ha-status pending"}>{order.status ? "Đã xác nhận" : "Chờ xử lý"}</span></td><td><div className="ha-row-actions"><button onClick={()=>setSelected(order)}>Chi tiết</button>{!order.status && <button disabled={busy===order._id} onClick={()=>confirmOrder(order)}>Duyệt</button>}<button className="danger" disabled={busy===order._id} onClick={()=>cancelOrder(order)}>Hủy</button></div></td></tr>)}
      </tbody></table></div>
      {!visible.length && <div className="ha-empty">Không có đơn hàng ở trạng thái này.</div>}
    </section>
    <Modal show={!!selected} onHide={()=>setSelected(null)} centered size="lg"><Modal.Header closeButton><Modal.Title>Chi tiết đơn hàng</Modal.Title></Modal.Header><Modal.Body>
      {selected && <><div className="ha-order-detail-meta"><div><small>Mã đơn</small><b>#{String(selected._id).slice(-8).toUpperCase()}</b></div><div><small>Số điện thoại / liên hệ</small><b>{selected.tell || "Chưa có"}</b></div><div><small>Địa chỉ giao hàng</small><b>{selected.address || "Chưa có"}</b></div><div><small>Ngày tạo</small><b>{selected.createAt || "Chưa có"}</b></div></div>
      <h6 className="mt-4 mb-3">Sản phẩm trong đơn</h6>{(selected.listOder || []).map((item,index)=><div className="ha-detail-product" key={index}><div><b>{item.title || item.name || "Sản phẩm"}</b><small>Số lượng: {item.quantily || 0}</small></div><strong>{formatMoney(item.toltalmoney)}</strong></div>)}<div className="ha-detail-total"><span>Tổng cộng</span><b>{formatMoney(total(selected))}</b></div></>}
    </Modal.Body><Modal.Footer><Button variant="light" onClick={()=>setSelected(null)}>Đóng</Button>{selected && !selected.status && <Button onClick={()=>confirmOrder(selected)}>Xác nhận đơn</Button>}</Modal.Footer></Modal>
  </div>;
};
export default Listorders;
