import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PORT } from '../constants';
import { StorageCartContext } from '../contexts/storagecartContext';

const Viewcart = () => {

  const { listStorage, increasequantily, loadingquanlyti, deletesoragecart2 } = useContext(StorageCartContext)
  const path = PORT;
  const { getStorageCart,storageLoading } = useContext(StorageCartContext);

  const [currenqunlyti, setcurrenqunlyti] = useState("")
  const push = useNavigate()
  const increase = async (data, id, money) => {
    const newdata = data + 1
    increasequantily(newdata, id, money)

  }
  const arr = listStorage.map((data, index) => {
    return [data.toltalmoney]
  })
  var sum = arr.reduce(function (total, number) {

    return total + (+number)
  }, 0);

  const decrease = async (data, id, money) => {
    if (data === 0) return
    const newdata = data - 1
    increasequantily(newdata, id, money)
    setcurrenqunlyti("")
  }
  const deletesoragecart = (e, id) => {
    deletesoragecart2(id)
    setcurrenqunlyti("")
  }
  useEffect(() => {
    getStorageCart() 
}, []);
if (storageLoading===false)
return (<Spinner style={{ position: "fixed", marginBottom: "25%", marginLeft: "50%" }}
    className="landing-inner"
    animation="border"
    variant="info"
></Spinner>)
  return (

    <div className='containerViewcart mt-5'>
      <div className='boxdetailcart'>
        {listStorage.map((data, index, arr) => (
          <div key={index} className="childrenboxcart">
            <img src={path + data.img} alt="ảnh" />
            <h4>{data.title}</h4>
            <div style={{ display: "flex" }}>
              <button style={{ width: "4rem", background: "black", color: "white", border: "none" }} onClick={() => {
                decrease(data.quantily, data._id, data.money)
                setcurrenqunlyti(data._id)
              }}  >Giảm</button>
              {(loadingquanlyti && data._id === currenqunlyti) ? <Spinner
                className="landing-inner"
                animation="border"
                variant="info"
                style={{ height: "40px" }}
              ></Spinner> : <p style={{ textAlign: "center" }} >{data.quantily}</p>}

              <button style={{ width: "4rem", background: "black", color: "white", border: "none" }} onClick={(e) => {
                increase(data.quantily, data._id, data.money)
                setcurrenqunlyti(data._id);
              }}>Tăng</button>
            </div>
            <p style={{ width: "10rem" }}>{data.toltalmoney.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}</p>

            <button onClick={(e) => deletesoragecart(e, data._id)} style={{ backgroundColor: "black", color: "white", border: "1px solid white",marginRight:"10px" }}>Xóa</button>

          </div>

        ))}
        <div style={{ color: "white", fontSize: "2rem", marginBottom: "2rem",fontWeight:"100" }}> {(sum===0)?"Giỏ Hàng Trống:Vui lòng quay lại Thêm Sản phẩm ":"Tổng tiền(chưa phí vận chuyển):"+ sum.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}</div>
        <button hidden={sum===0?true:false} onClick={() => push("/payment")} style={{ width: "25%", marginLeft: "40%", color: "white", background: "black", border: "white 1px solid" }}> Thanh Toán</button>


      </div>


    </div>
  )
};

export default Viewcart;

