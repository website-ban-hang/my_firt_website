import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { StorageCartContext } from '../../../contexts/storagecartContext';
import { storeContext } from '../../../contexts/StoreContext';

const Detailcrat = () => {
  const params = useParams()
  const { Findcartbyid, detail, detaillCarLoading,getListStore,detailcart } = useContext(storeContext)
  const { addstorageCart,listStorage } = useContext(StorageCartContext)
  const totalcart = 1
  const [quantily, setquantily] = useState(1)
  const [address, setAddress] = useState("Quảng nam")
  const path = "http://localhost:3000/";
  const navigate = useNavigate();

  const handlechange = (e) => {
    setquantily((e.target.value) > 50 || (e.target.value) < 1 ? quantily : [e.target.name] = e.target.value)
  }
  const addstorage = () => {
    addstorageCart(detail[0], quantily,address)
  }

  useEffect(()=>{
    detailcart(params)
  },[])
  if (detaillCarLoading)
    return (<Spinner style={{ position: "fixed", marginBottom: "20%", marginLeft: "50%" }} className="landing-inner" animation="border" variant="info"></Spinner>)
  return <Container style={{ width: "100%", padding: "0%" }}>
    <div className='DetailCart'>
      <Row className='containerdetail'>
        <Col className='detaimoney1'>
          <Row >
            <Card.Img className='itemimg'
              variant="top"
              src={path + detail[0].img}
            />
          </Row>
          <Row className='statusdetail'>{detail[0].status}
          </Row>
        </Col>

        <Col className='detaimoney2' >{detail[0].title}
          <Row className='mt-5 childrendetaimoney2'>
            <Col lg="4">Số lượng : Còn Hàng</Col>
            <Col style={{ fontWeight: "normal", textTransform: "uppercase", opacity: "0.5" }} >ĐÃ bán</Col>
          </Row>
          <Row className=' childrendetaimoney2' ><h2>{((detail[0].money) * quantily).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}</h2>
          </Row>
          <Row className='mt-3 childrendetaimoney2'>
            <Col lg="4">Vận chuyển</Col>
            <Col lg="3">Vận chuyển Đến</Col>
            <Col lg="3" >
              <Form.Select onChange={(e) => {
                  setAddress((e.target.options[e.target.options.selectedIndex]).text)
                }} aria-label="Default select ">
                <option disabled  >Chọn Nơi Đến </option>x
                <option value="1">Quảng nam</option>
                <option value="2">Đà Nẵng</option>
                <option value="3">Hồ Chí Minh </option>
              </Form.Select>
            </Col>
          </Row>
          <Row className='mt-3 childrendetaimoney2'>
            <Col lg="4" >Số lượng</Col>
            <Col lg="2" ><Form.Control
              value={quantily} onChange={(e) => handlechange(e)} name="quantily" min="1" max="50" type="number"></Form.Control></Col>
            <Col lg="1" ></Col>
            <Col lg="4" >Còn lại 2</Col>

          </Row >
          <Row className='mt-4 childrendetaimoney2 '>
            <Col ><Button className='btndetail' style={{ background: "black", border: "none", color: "white" }} onClick={(e) => {
              e.preventDefault()
              addstorage(detail[0])
            }}>Thêm Vào giỏ hàng</Button></Col>
            <Col ><Button className='btndetail' style={{ background: "black", border: "2px solid white", color: "white" }} onClick={(e) => {
              e.preventDefault()
              addstorage(detail[0])
              setTimeout(() => navigate("/viewcart"), 1000)
           
            }}>Mua Ngay</Button></Col>

          </Row>

        </Col>


      </Row>

    </div>
  </Container>;
};

export default Detailcrat;
