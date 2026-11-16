import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Spinner } from "react-bootstrap";
import { FiEdit2, FiFileText, FiPlus, FiTrash2 } from "react-icons/fi";
import { PORT } from "../../../constants";
import "./AdminBlog.css";

const emptyForm = { title: "", excerpt: "", content: "", category: "Tin cửa hàng", status: "draft" };
const dateFor = value => value ? new Date(value).toLocaleDateString("vi-VN") : "Chưa đăng";

export default function AdminBlog() {
  const [articles,setArticles] = useState([]);
  const [form,setForm] = useState(emptyForm);
  const [editing,setEditing] = useState(null);
  const [cover,setCover] = useState(null);
  const [preview,setPreview] = useState("");
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);
  const [notice,setNotice] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const response=await axios.get(`${PORT}articles/admin/all`); setArticles(response.data.articles || []); }
    catch(error) { setNotice({type:"error",message:error.response?.data?.message || "Không thể tải bài viết"}); }
    finally { setLoading(false); }
  };
  useEffect(()=>{load();},[]);
  const change = event => setForm(current=>({...current,[event.target.name]:event.target.value}));
  const chooseCover = event => { const file=event.target.files?.[0] || null; setCover(file); setPreview(file ? URL.createObjectURL(file) : ""); };
  const reset = () => { setEditing(null);setForm(emptyForm);setCover(null);setPreview(""); };
  const edit = item => { setEditing(item._id);setForm({title:item.title||"",excerpt:item.excerpt||"",content:item.content||"",category:item.category||"Tin cửa hàng",status:item.status||"draft"});setCover(null);setPreview(item.hasCoverImage ? `${PORT}articles/image/${item._id}` : "");window.scrollTo({top:0,behavior:"smooth"}); };
  const submit = async event => {
    event.preventDefault();
    if(!form.title.trim()||!form.excerpt.trim()||!form.content.trim()){setNotice({type:"error",message:"Vui lòng nhập đủ tiêu đề, tóm tắt và nội dung."});return;}
    const data=new FormData();Object.entries(form).forEach(([key,value])=>data.append(key,value));if(cover)data.append("cover",cover);
    setSaving(true);
    try {
      if(editing) await axios.put(`${PORT}articles/${editing}`,data);
      else await axios.post(`${PORT}articles`,data);
      setNotice({type:"success",message:form.status==="published"?"Bài viết đã được đăng lên Blog.":"Bản nháp đã được lưu."});
      reset();await load();
    } catch(error) { setNotice({type:"error",message:error.response?.data?.message || "Không thể lưu bài viết"}); }
    finally { setSaving(false); }
  };
  const remove = async item => {
    if(!window.confirm(`Bạn có chắc muốn xóa bài viết “${item.title}”?`)) return;
    try { await axios.delete(`${PORT}articles/${item._id}`);setNotice({type:"success",message:"Đã xóa bài viết."});await load();if(editing===item._id)reset(); }
    catch(error) { setNotice({type:"error",message:error.response?.data?.message || "Không thể xóa bài viết"}); }
  };
  return <div className="ha-blog-admin">
    <div className="ha-page-heading"><div><div className="ha-eyebrow">CONTENT MANAGEMENT</div><h1>Quản lý Blog</h1><p>Viết bài giới thiệu cửa hàng, chia sẻ kiến thức và đăng tin mới đến khách hàng.</p></div><span className="ha-date-chip">{articles.length} bài viết</span></div>
    {notice&&<div className={`ha-blog-notice ${notice.type}`}>{notice.message}<button onClick={()=>setNotice(null)}>×</button></div>}
    <div className="ha-blog-admin-layout">
      <section className="ha-panel ha-blog-editor"><div className="ha-panel-heading"><div><h2>{editing?"Chỉnh sửa bài viết":"Viết bài mới"}</h2><p>Nội dung được lưu an toàn trong cơ sở dữ liệu cửa hàng.</p></div><FiFileText/></div>
        <Form onSubmit={submit}>
          <Form.Group className="mb-3"><Form.Label>Tiêu đề bài viết *</Form.Label><Form.Control name="title" value={form.title} onChange={change} maxLength={180} placeholder="VD: Chào mừng bạn đến với Hoàng Ánh Điện Máy" required/></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Chuyên mục</Form.Label><Form.Select name="category" value={form.category} onChange={change}><option>Tin cửa hàng</option><option>Giới thiệu</option><option>Kiến thức điện nước</option><option>Sản phẩm mới</option><option>Khuyến mãi</option></Form.Select></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Mô tả ngắn *</Form.Label><Form.Control as="textarea" rows={2} name="excerpt" value={form.excerpt} onChange={change} maxLength={360} placeholder="Một đoạn giới thiệu ngắn hiển thị ở danh sách Blog..." required/></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Nội dung bài viết *</Form.Label><Form.Control as="textarea" rows={10} name="content" value={form.content} onChange={change} maxLength={30000} placeholder="Viết nội dung bài viết tại đây. Có thể xuống dòng để chia đoạn..." required/><Form.Text>{form.content.length}/30.000 ký tự · Hỗ trợ xuống dòng và chia đoạn.</Form.Text></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Ảnh bìa (không bắt buộc)</Form.Label><Form.Control type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseCover}/><Form.Text>JPG, PNG hoặc WEBP · tối đa 4 MB · ảnh được lưu trong MongoDB.</Form.Text></Form.Group>
          {preview&&<div className="ha-blog-cover-preview"><img src={preview} alt="Ảnh bìa xem trước"/><button type="button" onClick={()=>{setCover(null);setPreview("");}}>×</button></div>}
          <Form.Group className="mb-3"><Form.Label>Trạng thái bài viết</Form.Label><Form.Select name="status" value={form.status} onChange={change}><option value="draft">Lưu bản nháp (chưa hiển thị)</option><option value="published">Đăng công khai</option></Form.Select></Form.Group>
          <div className="ha-blog-editor-actions"><Button type="submit" disabled={saving}>{saving?<><Spinner size="sm"/> Đang lưu...</>:editing?"Lưu thay đổi":<><FiPlus/> Lưu bài viết</>}</Button>{editing&&<Button variant="light" type="button" onClick={reset}>Hủy chỉnh sửa</Button>}</div>
        </Form>
      </section>
      <section className="ha-panel ha-blog-admin-list"><div className="ha-panel-heading"><div><h2>Bài viết đã tạo</h2><p>Quản lý trạng thái hiển thị của từng bài.</p></div></div>
        {loading?<div className="ha-blog-admin-loading"><Spinner animation="border"/> Đang tải bài viết...</div>:articles.length?articles.map(item=><article className="ha-blog-admin-row" key={item._id}><div className="ha-blog-admin-thumb">{item.hasCoverImage?<img src={`${PORT}articles/image/${item._id}`} alt=""/>:<FiFileText/>}</div><div className="ha-blog-admin-row-info"><b>{item.title}</b><small>{item.category} · {dateFor(item.publishedAt||item.createdAt)}</small><span className={item.status==="published"?"published":"draft"}>{item.status==="published"?"Đang hiển thị":"Bản nháp"}</span></div><div className="ha-blog-admin-actions"><button onClick={()=>edit(item)} aria-label="Sửa bài viết"><FiEdit2/></button><button className="delete" onClick={()=>remove(item)} aria-label="Xóa bài viết"><FiTrash2/></button></div></article>):<div className="ha-blog-admin-loading">Chưa có bài viết nào. Hãy tạo bài viết đầu tiên.</div>}
      </section>
    </div>
  </div>;
}
