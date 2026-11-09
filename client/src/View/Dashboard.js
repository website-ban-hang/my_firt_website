import React, { useContext, useEffect, useState } from "react";
import { Card, Carousel, Col, Row, Spinner } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PORT } from "../constants";
import { Authcontext } from "../contexts/Authcontext";
import { StorageCartContext } from "../contexts/storagecartContext";
import { storeContext } from "../contexts/StoreContext";
import AlertMessage from "./AlertMessage";
import slider from "../assets/React App_files/slider1.jpeg";
import slider2 from "../assets/React App_files/slider2.jpeg";
import slider3 from "../assets/React App_files/slider3.jpeg";
import map from "../assets/React App_files/map.png";
import logoauthentication from "../assets/React App_files/logoauthentication.jpeg";
import logowebwite from "../assets/React App_files/logoweb.jpeg";

const Dashboard = () => {
  const push = useNavigate();

  const {
    authState: { isAuathenticated },
    storeLoading,
  } = useContext(Authcontext);
  const path = PORT;
  const { listpost, Findcartbyid, dispath, detaillCarLoading,getListStore,detailcart } =
    useContext(storeContext);
  const { getStorageCart } = useContext(StorageCartContext);


  //phân trang
  const [currenPage, setcurrenPage] = useState(0);
  const [postPerPage, setpostPerPage] = useState(24);
  const [textinput, settexinput] = useState("");
  const newlistpost = listpost.slice(currenPage, postPerPage);
  const [newlist, setnewlist] = useState(newlistpost);
  let pageNumber = [];
  const totalpost = Math.ceil(listpost.length / 24);
  const [alert, setalert] = useState(null);
  for (let i = 0; i < totalpost; i++) {
    pageNumber.push(i);
  }
  const PageNext = (number) => {
    const curren = number * 24;
    setcurrenPage(curren)
    setpostPerPage(curren + 24)
    setnewlist(listpost.slice(curren, curren + 24));
  };
  useEffect(()=>{setnewlist(newlistpost)},[])

  const actionsearchbtn = () => {
 
    const data2 = newlistpost.filter((user) => {

      return (
        user.title
          .toLocaleLowerCase()
          .indexOf(textinput.toLocaleLowerCase()) !== -1
          
      );
    });
    if (data2.length > 0) {
      return setnewlist(data2);
      
    } else {
      setalert({
        type: "danger",
        message: "VUi lòng nhập lại  TÊN Thú Cưng  KHÁC",
      });
      setTimeout(() => {
        setalert(null);
      }, 2000);
      setnewlist(newlistpost);
    }
  };
  const detailcartdb =(data)=>{
    detailcart(data);
    push(data._id);
  }
  useEffect(()=>{
    getStorageCart() 
      getListStore()},[])
  if (storeLoading)
    return (
      <Spinner
        style={{ position: "fixed", marginBottom: "25%", marginLeft: "50%" }}
        className="landing-inner"
        animation="border"
        variant="info"
      ></Spinner>
    );



  if (isAuathenticated)
    return (
      <div className="containerHome mt-3  ">
        <Row className="justify-content-center mb-5 ">
          <Col xl={10} lg={10} xxl={12}>
            <Carousel fade>
              <Carousel.Item interval={800}>
                <img
                  height={500}
                  width={100}
                  className="d-block  w-100"
                  src={slider}
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3 style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                    Hãy Lựa CHọn CHo Mình{" "}
                  </h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={800}>
                <img
                  height={500}
                  width={400}
                  className="d-block  w-100"
                  src={slider2}
                  alt="Second slide"
                />

                <Carousel.Caption>
                  <h3 style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                    Một Người Bạn Đồng Hành
                  </h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={800}>
                <img
                  height={500}
                  width={300}
                  className="d-block w-100"
                  src={slider3}
                  alt="Third slide"
                />

                <Carousel.Caption>
                  <h3 style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                    {" "}
                    Trên cả tuyệt vời với đồng hành của bạn{" "}
                  </h3>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>

        <div
          className="rowcontainerhome  "
          style={{ position: "fixed", top:0, zIndex: 3 }}
        >
    
          <div className="searchhome">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  actionsearchbtn();
                }
              }}
              className="inputserchhome"
              onChange={(e) => {
                settexinput(e.target.value);
                if (e.target.value === "") {
                  setnewlist(newlistpost);
                }
              }}
              size={40}
            ></input>
            <button
              type="submit"
              onClick={(e) => actionsearchbtn()}
              className="btnsearch"
            >
              Tìm Kiếm
            </button>
          </div>
          <AlertMessage style={{ zIndex: 2 }} info={alert}></AlertMessage>
        </div>

        <Row sm={5}>
          {newlist.map((data, index) => (
            <Col
              className="mt-1 "
              style={{ height: "19rem", width: "14rem" }}
              key={index}
            >
              <Card
                className="cart"
                onClick={() => detailcartdb(data)}
                style={{
                  maxHeight: "18rem",
                  minHeight: "18rem",
                  maxWidth: "13rem",
                }}
              >
                <Card.Img
                  style={{
                    maxHeight: "10rem",
                    minHeight: "10rem",
                    maxWidth: "8rem",
                    minWidth: "100%",
                  }}
                  variant="top"
                  src={path + data.img}
                />

                <Card.Body>
                  <Card.Title className="texttile">{data.title} </Card.Title>
                  <Card.Text className="ellipsis">{data.status}</Card.Text>
                  <Card.Text className="ellipsis2">
  {"Giá: " +
    (data.money == null
      ? "Chưa cập nhật"
      : Number(data.money).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }))}
</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="page-item-div">
          {pageNumber.map((number, index) => (
            <Link
              onClick={() => PageNext(number)}
              key={index}
              to="#"
              className="page-item"
            >
              {number + 1}
            </Link>
          ))}
        </div>
        <Row className=" me-5 mb-4 justify-content-center boxaddress">
          <Col>
            <h1 style={{ color: "white" }}>ADDRESS</h1>
          </Col>
          <Col xl={11} className="mb-5">
            {" "}
            <Card.Img height={400} variant="top" src={map} />
            
          </Col>
        </Row>
        <Row className="boxinfomation ">
          <Col >
            <Row>
              <Col>
                <Col>
                  <h4 className="mt-5">WEBSITE:ABC.COM</h4>
                  <img height={120} src={logowebwite} alt="" />
                </Col>
              </Col>
              <Col>
                <h2>HỔ trợ khách hàng</h2>
                <h4 className="mt-5">Chính sách hổ trợ khách hàng</h4>
                <p>Nhanh chóng</p>
                <p>đảm bảo chất lượng</p>
                <p>Uy tín</p>
              </Col>
              <Col>
                <h2>Về Chúng tôi</h2>
                <h5 className="mt-5">Mọi thắc mắc vui lòng liên hệ</h5>
                <p>EMAIL:xhieu213@gmail.com</p>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <h4>SỐ Điện Thoại</h4>
                    <p className="mt-5">038999053</p>
                    <h3>Chứng nhận</h3>
                    <img height={120} src={logoauthentication} alt="" />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{textAlign:"center",background:"#291804"}}> 
          <span style={{color:"white"}}>Công ty TNHH dịch vụ thú cưng ABC- Địa chỉ: 20 Xuân Diệu Huyện Thăng BÌnh, Hà Lam Tỉnh Quảng nam, Việt Nam </span>
          <span style={{color:"white"}}>Giấy ĐKKD số: 12345667 do Sở Kế hoạch và Đầu tư Quảng nam cấp lần đầu ngày .....</span>
          <span style={{color:"white"}}>Email: xhieu213@gmail.com-Đường dây nóng: 0389998053</span>
        </Row>
      </div>
    );
  else return <Navigate to="/login"></Navigate>;
};

export default Dashboard;
