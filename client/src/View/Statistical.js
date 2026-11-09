import React, { useContext, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { ListOderCOntext } from "../contexts/ListoderContext";

const Statistical = () => {
  const [valueSelect, setvalueSelect] = useState("");
  const [valueSelectyear, setvalueSelectyear] = useState("");

  const [valuetotal, setvaluetotal] = useState("");
  const [fillterproduct, setfillterproduct] = useState([]);
  let arr = []


  const { listtheoder, getlsitcartoderadmin, loadingListoder } = useContext(ListOderCOntext)
  console.log(listtheoder)
  const onchangeselect = (e) => {
    console.log(valueSelect)
    setvalueSelect(e.target.value)
    console.log(valueSelectyear)
    listtheoder.map((data, index) => {
      const textcurrent = data.createAt.slice(4, 7)
      const textcurrentyear = data.createAt.slice(0, 4)


      if (textcurrent === `-0${e.target.value}` && textcurrentyear === valueSelectyear || e.target.value==="" )
        return (
          arr.push(data)
          // setfillterproduct(...fillterproduct,data)
        )
        else if (e.target.value==="0000"){
          arr.push(data)
        }
    })
    setfillterproduct(arr)


  }
  const onchangeselectyear = (e) => {
    setvalueSelectyear(e.target.value)
    listtheoder.map((data, index) => {
      const textcurrent = data.createAt.slice(0, 7)
      const textcurrentyear = data.createAt.slice(0, 4)
      if (textcurrent.search(`-0${valueSelect}`) != -1 && textcurrentyear.search(e.target.value) != -1 )
        return (
          arr.push(data)
          // setfillterproduct(...fillterproduct,data)
        )
       
  
    })
    setfillterproduct(arr)
  }
  console.log(fillterproduct)

  useEffect(() => {
    getlsitcartoderadmin()
  }, [])
  return (
    <Row className="container">
      <Col>
        <h1 style={{ color: "white", fontSize: "20px" }}>Theo Tháng/Tổng Số Tiền </h1>
        <Row>
          <Col xxl={5}>
            <Form.Select
              onChange={(e) => onchangeselect(e)}
              aria-label="Default select example"
            >
              <option value="0000">Tất Cả</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </Form.Select>
          </Col>
          <Col xxl={5}>
            <Form.Select
              onChange={(e) => onchangeselectyear(e)}
              aria-label="Default select example"
            >
              <option value="00000">Chọn Năm</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>

            </Form.Select>
          </Col>
          <Col
            xxl={10}
            className="p-5 boxMonthdetail d-flex justify-content-center mt-5"
          >
            <Row   >
              <h3  style={{ color: "red",fontSize:"18px" }} >{(valueSelect ? `Đây là Đơn hàng của ${(valueSelect==="0000" ? "Tất Cả" : `tháng  ${valueSelect}`  )} ` : "Vui lòng CHọn  Tháng")}</h3>
              <h1 style={{ fontSize: "30px",fontSize:"18px" }} hidden={valueSelect === ""}> {fillterproduct.length === 0 ? "đơn hàng trống" : `Đơn hàng  ${(valueSelect==="0000"? "":` trong tháng ${valueSelect}`)}  là ${fillterproduct.length}`}</h1>

            </Row>
          </Col>
        </Row>
      </Col>
      <Col>
        <h1 style={{ color: "white" }}>Chi tiết đơn hàng </h1>
        {fillterproduct.map((data,index)=>(
          <div key={index} className="detailstatict mt-2" style={{background:"white"}}>
            <span className="me-4 ms-2"> tháng {data.createAt.slice(5,7)} năm {data.createAt.slice(0,4)}</span>
            <span style={{minWidth:"150px"}} className="me-3"> SDT : {data.address}</span>
            <span style={{minWidth:"200px"}} className="addresssstatic me-5"> địa chỉ : {data.tell}</span>
      



            

          </div>
        ))}
        <div style={{background:"white" ,justifyContent:"center",borderRadius:"10px"}} className="mt-4">
        <span hidden={fillterproduct.length===0} style={{borderRadius:"10px",fontSize:"20px"}} className="  mt-5"> Tổng đơn : {fillterproduct.length}</span>

        </div>
      </Col>
      
    </Row>
  );
};

export default Statistical;
