import React, { useContext, useMemo, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { PORT } from "../../../constants";
import { storeContext } from "../../../contexts/StoreContext";

const AddItem = () => {
  const { send, alert, setalert, storeLoading, listpost = [], deleteCartStore, EditCartItem2 } = useContext(storeContext);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [money, setMoney] = useState("");
  const [stock, setStock] = useState("0");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const pageSize = 8;
  const filtered = useMemo(() => listpost.filter(item => [item.title,item.status].some(value => String(value || "").toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")))), [listpost,query]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page-1)*pageSize,page*pageSize);
  const clearForm = () => { setEditing(null); setTitle(""); setStatus(""); setMoney(""); setStock("0"); setFile(null); setPreview(""); };
  const chooseFile = event => { const selected = event.target.files?.[0] || null; setFile(selected); setPreview(selected ? URL.createObjectURL(selected) : ""); };
  const startEdit = item => { setEditing(item); setTitle(item.title || ""); setStatus(item.status || ""); setMoney(String(item.money ?? "")); setStock(String(item.stock ?? 0)); setFile(null); setPreview(item.img ? (String(item.img).startsWith("http") ? item.img : PORT + String(item.img).replace(/^\/+/, "")) : ""); window.scrollTo({top:0,behavior:"smooth"}); };
  const submit = async event => {
    event.preventDefault();
    if (!title.trim() || !money || (!editing && !file)) { setalert({type:"danger",message:"Vui lòng nhập tên, giá bán và chọn ảnh cho sản phẩm mới."}); return; }
    const form = new FormData(); form.append("title",title.trim()); form.append("status",status); form.append("money",money); form.append("stock",stock); if(file) form.append("file",file);
    setSaving(true);
    const result = editing ? await EditCartItem2(editing,form) : await send(form);
    setSaving(false);
    if(result?.success){ clearForm(); setalert({type:"success",message:editing?"Đã cập nhật sản phẩm.":"Đã thêm sản phẩm."}); }
  };
  const remove = async item => { if(!window.confirm(`Bạn chắc chắn muốn xóa sản phẩm “${item.title}”?`)) return; const result = await deleteCartStore(item._id); if(result?.success) setalert({type:"success",message:"Đã xóa sản phẩm."}); };
  if(storeLoading) return <div className="ha-loading"><Spinner animation="border"/>Đang tải sản phẩm...</div>;
  return <div className="ha-products">
    <div className="ha-page-heading"><div><div className="ha-eyebrow">CATALOG MANAGEMENT</div><h1>Quản lý sản phẩm</h1><p>Thêm mới, cập nhật thông tin và quản lý hình ảnh sản phẩm.</p></div><span className="ha-date-chip">{listpost.length} sản phẩm</span></div>
    {alert && <div className={`ha-alert ${alert.type === "success" ? "success" : "error"}`}>{alert.message}<button onClick={()=>setalert(null)}>×</button></div>}
    <div className="ha-product-layout">
      <section className="ha-panel ha-product-form"><div className="ha-panel-heading"><div><h2>{editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2><p>Thông tin đang được lưu qua API cửa hàng hiện tại</p></div></div>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3"><Form.Label>Tên sản phẩm <span>*</span></Form.Label><Form.Control value={title} onChange={e=>setTitle(e.target.value)} placeholder="VD: Máy bơm nước 750W" required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Giá bán (VNĐ) <span>*</span></Form.Label><Form.Control type="number" min="0" value={money} onChange={e=>setMoney(e.target.value)} placeholder="Nhập giá bán" required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Số lượng tồn kho (sản phẩm) <span>*</span></Form.Label><Form.Control type="number" min="0" step="1" value={stock} onChange={e=>setStock(e.target.value)} placeholder="Nhập số lượng tồn kho" required /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Mô tả sản phẩm</Form.Label><Form.Control as="textarea" rows={4} value={status} onChange={e=>setStatus(e.target.value)} placeholder="Thông số, công dụng, bảo hành..." /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Ảnh sản phẩm {!editing && <span>*</span>}</Form.Label><Form.Control type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={chooseFile}/><Form.Text>JPG, PNG, WEBP hoặc GIF · tối đa 3 MB · ảnh mới lưu trong MongoDB.</Form.Text></Form.Group>
          {preview && <div className="ha-image-preview"><img src={preview} alt="Xem trước sản phẩm"/><button type="button" onClick={()=>{setFile(null);setPreview(editing?.img ? PORT + String(editing.img).replace(/^\/+/, "") : "");}}>×</button></div>}
          <div className="ha-form-actions"><Button type="submit" disabled={saving}>{saving ? "Đang lưu..." : editing ? "Lưu thay đổi" : "＋ Thêm sản phẩm"}</Button>{editing && <Button type="button" variant="light" onClick={clearForm}>Hủy sửa</Button>}</div>
        </Form>
        <div className="ha-data-note">Số lượng tồn kho được lưu cùng thông tin sản phẩm và hiển thị ở trang chi tiết. Với sản phẩm cũ chưa có số liệu, hãy chọn Sửa và nhập số lượng thực tế.</div>
      </section>
      <section className="ha-panel ha-product-list"><div className="ha-panel-heading"><div><h2>Danh sách sản phẩm</h2><p>Tìm kiếm và thao tác trên dữ liệu thật</p></div></div>
        <div className="ha-search"><span>⌕</span><input value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} placeholder="Tìm theo tên hoặc mô tả sản phẩm..."/></div>
        <div className="ha-product-table-wrap"><table className="ha-product-table"><thead><tr><th>SẢN PHẨM</th><th>GIÁ BÁN</th><th>TỒN KHO</th><th>THAO TÁC</th></tr></thead><tbody>
          {rows.map(item=><tr key={item._id}><td><div className="ha-product-cell"><img src={item.img ? (String(item.img).startsWith("http") ? item.img : PORT+String(item.img).replace(/^\/+/, "")) : ""} alt="" onError={e=>{e.currentTarget.style.opacity=0;}}/><div><b>{item.title || "Chưa đặt tên"}</b><small>{item.status || "Chưa có mô tả"}</small></div></div></td><td><strong>{Number(item.money || 0).toLocaleString("vi-VN")} ₫</strong></td><td><strong>{item.stock == null ? "Chưa cập nhật" : `${item.stock} sản phẩm`}</strong></td><td><div className="ha-row-actions"><button onClick={()=>startEdit(item)}>Sửa</button><button className="danger" onClick={()=>remove(item)}>Xóa</button></div></td></tr>)}
        </tbody></table></div>
        {!rows.length && <div className="ha-empty">Không tìm thấy sản phẩm phù hợp.</div>}
        <div className="ha-pagination"><span>Trang {page}/{pages} · {filtered.length} sản phẩm</span><div><button disabled={page===1} onClick={()=>setPage(page-1)}>←</button><button disabled={page===pages} onClick={()=>setPage(page+1)}>→</button></div></div>
      </section>
    </div>
  </div>;
};
export default AddItem;
