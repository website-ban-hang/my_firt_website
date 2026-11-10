import React, { useContext, useState } from "react";
import axios from "axios";
import { Button, Col, Container, Figure, Form, Row, Spinner, Table } from 'react-bootstrap'
import AlertMessage from "../../../View/AlertMessage";
import { storeContext } from "../../../contexts/StoreContext";
import { Link } from "react-router-dom";
import { PORT } from "../../../constants";

const AddItem = () => {
  const { send, alert, setalert, storeLoading, listpost, deleteCartStore, EditCartItem2 } = useContext(storeContext)
  const [statusEdit, setstatusEdit] = useState(true)
  const [statusBtn, setstatusBtn] = useState(false)
  const [dataformEdit, setdataformEdit] = useState("")

  const data = new FormData()
  const [file, setfile] = useState()
  const [title, settitle] = useState("")
  const [status, setstatus] = useState("")
  const [money, setmoney] = useState("")
  data.append('file', file)
  data.append("title", title)
  data.append("status", status)
  data.append("money", money)
  const submitformaddcart = async (e) => {
    e.preventDefault();
    if (!file) return setalert({ message: "Bạn đang thiếu ảnh, vui lòng chọn ảnh sản phẩm.", type: "danger" });
    setstatusBtn(true);
    const result = await send(data);
    setstatusBtn(false);
    if (!result || result.success !== true) return;
    setfile(null);
    settitle("");
    setstatus("");
    setmoney("");
    const fileInput = document.getElementsByClassName("file")[0];
    if (fileInput) fileInput.value = "";
  }
  const hieu = 1231312312321213
  const hieu2 = hieu.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
  const [currenPage, setcurrenPage] = useState(0);
  const [postPerPage, setpostPerPage] = useState(4);
  const newlistpost = listpost.slice(currenPage, postPerPage);
  const [newlist, setnewlist] = useState(newlistpost);


  const pageNumber = [];
  const totalpost = Math.ceil(listpost.length / 4);
  for (let i = 0; i < totalpost; i++) {
    pageNumber.push(i);
  }
  const PageNext = (number) => {
    const curren = number * 4
    setcurrenPage(curren)
    setpostPerPage(curren + 4)

    setnewlist(listpost.slice(curren, curren + 4))
  };
  const onlickopenBTn = (value) => {
    setstatusEdit(false);
    setstatusBtn(true);
    setdataformEdit(value);
    settitle(value.title || "");
    setstatus(value.status || "");
    setmoney(String(value.money ?? ""));
    setfile(null);
    const fileInput = document.getElementsByClassName("file")[0];
    if (fileInput) fileInput.value = "";
  };

  const submitEdit = async () => {
    if (!dataformEdit || !dataformEdit._id) return;
    const editData = new FormData();
    if (file) editData.append("file", file);
    editData.append("title", title);
    editData.append("status", status);
    editData.append("money", money);
    setstatusBtn(true);
    const result = await EditCartItem2(dataformEdit, editData);
    setstatusBtn(false);
    if (result && result.success) {
      setstatusEdit(true);
      setdataformEdit("");
      setfile(null);
      settitle("");
      setstatus("");
      setmoney("");
      if (document.getElementsByClassName("file")[0]) document.getElementsByClassName("file")[0].value = "";
    }
  }
  

  if (storeLoading)
    return (<Spinner style={{ position: "fixed", marginBottom: "25%", marginLeft: "50%" }} className="landing-inner" animation="border" variant="info"></Spinner>)
  return (

    <div >
      <Container>
        <Row  >

          <Col sm={8} className="addcart2">
            <AlertMessage info={alert}></AlertMessage>
            {newlistpost.map((value, index) => (
              <Table key={index} style={{ color: "white" }} bordered >
                <thead>
                  <tr >
                    <th style={{ background: "rgba(0, 0, 0, 0.7) ", color: "white" }}>IMG</th>
                    <th style={{ background: "rgba(0, 0, 0, 0.7) ", color: "white" }}>TIÊU ĐỀ Bài đăng</th>
                    <th style={{ background: "rgba(0, 0, 0, 0.7) ", color: "white" }}>Nội dung bài đã đăng</th>
                    <th style={{ background: "rgba(0, 0, 0, 0.7) ", color: "white" }}>Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ minWidth: "40px", maxWidth: "40px", height: "80%" }} className="textstatus">
                      <Figure>
                        <Figure.Image
                          style={{ height: "50px" }}
                          alt="100x100"
                          src={value.img ? `${PORT}${String(value.img).replace(/^\/+/, "")}` : undefined}
                        />
                      </Figure>
                    </td>
                    <td style={{ maxWidth: "30px", maxHeight: "30px" }} className="textstatus"  >{value.title}</td>
                    <td style={{ maxWidth: "20px", minWidth: "20px" }} className="textstatus">{value.status}</td>
                    <td style={{ maxWidth: "20px", minWidth: "20px" }} className="textstatus">
                      <Button className="mt-5 btnList" style={{ marginRight: "5px" }} onClick={() => onlickopenBTn(value, data)}  >Sửa</Button>
                      <Button className="mt-5 btnList" style={{ marginRight: "5px" }} onClick={() => deleteCartStore(value._id)} >Xóa</Button>
                    </td>
                  </tr>


                </tbody>
              </Table>
            ))}
          </Col>




          <Col style={{ position: "relative" }}>
            <AlertMessage info={alert} ></AlertMessage>
            <Form onSubmit={submitformaddcart} encType="multipart/form-data" className="addcart" >
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Tên Sản phẩm</Form.Label>
                <Form.Control as="textarea" value={title} onChange={(e) => {
                  const title = e.target.value
                  settitle(title)
                }} name="title" type="text" placeholder="Nhập Tên Sản Phẩm" />
                <Form.Text className="text-muted">
                  XUANHIEU.COM
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Miêu Tả</Form.Label>
                <Form.Control value={status} onChange={(e) => {
                  const status = e.target.value
                  setstatus(status)

                }} as="textarea" name="status" rows="4" type="text" placeholder="Nhập Mô Tả Sản Phẩm" />
              </Form.Group>
              <Form.Group className='mb-3' >
                <Form.Label>Nhập Số tiền</Form.Label>

                <Form.Control onChange={(e) => {
                  const money = e.target.value
                  setmoney(money)
                }} value={money} type="number" placeholder='money' required name="money" autoComplete='on'></Form.Control>
              </Form.Group >
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Label> Hình Ảnh của Sản phẩm</Form.Label>
                <Form.Control name="file" type="file" className="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => {
                  const file = e.target.files[0]
                  setfile(file)
                }} placeholder="chọn file" />

              </Form.Group>
              <Button className="me-3" variant="primary" type="submit" disabled={statusBtn}>
              Xác nhận
              </Button  >
              <Button variant="primary" type="button" disabled={statusEdit || statusBtn} onClick={submitEdit}>
                SỬA
              </Button  >
              <div className="page-item-Additem">
                {pageNumber.map((number, index) => (

                  <Link
                    onClick={() => PageNext(number)}
                    key={index}
                    to="#"
                    className="page-item2"
                  >
                    {number + 1}
                  </Link>

                ))}</div>
            </Form>


          </Col>
        </Row>

      </Container>



    </div>
  );
};

export default AddItem;
