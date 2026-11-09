import React, { useContext, useEffect, useState } from 'react';
import { StorageCartContext } from '../../contexts/storagecartContext';
import { useNavigate } from 'react-router-dom'
import { Spinner } from 'react-bootstrap';
import AlertMessage from '../../View/AlertMessage';


const Payment = () => {
    const push = useNavigate()
    const path = "http://localhost:3000/";
    const { listStorage, sendlistpayment,getStorageCart } = useContext(StorageCartContext)
    const [alert, setalert] = useState(null)
    const arr = listStorage.map((data, index) => {
        return [data.toltalmoney]
    })

    const [loadingpaymen, setloadingpaymen] = useState(false)
    var sum = arr.reduce(function (total, number) {
        const newnumber = +number
        return total + newnumber 
    }, 30000);
    const [addresss, setAddress] = useState({
        address: "",
        tell: ""
    })
    const { address, tell } = addresss



    const onchangeInputAddress = (e) => {
        setAddress({ ...addresss, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        getStorageCart() 
    }, []);
    const submittheoder = async () => {
       try {
       
        if(tell===""){
         setalert({ type: "danger", message:"Số Điện Thoại KHông được bỏ trống" })
         return   setTimeout(() => {
                setalert(null)
            }, 2000);
        }
        setloadingpaymen(true)
        await sendlistpayment(tell, address, listStorage)
    setTimeout(()=>{
        push("/finishedoder")
    },200)
       } catch (error) {
           return console.log(error)
       }
    }
    if (loadingpaymen) return (<Spinner style={{ position: "fixed", marginBottom: "25%", marginLeft: "50%" }}
        className="landing-inner"
        animation="border"
        variant="info"
    ></Spinner>)
    else
    return <div className='containerPaymenent mt-5'>

        <div className='itemPayment'>
            <div className='topcontainerPayment'>
                <marquee >
                    Nếu Bạn muốn Hổ trợ Vui lòng Liên hệ  0389998053 Hoặc Email:xhieu213@gmail.com
                </marquee>
            </div>
            <AlertMessage info={alert}></AlertMessage>
           <div className='d-flex justify-content-center'>
      <span style={{ color: "lawngreen" ,fontSize:"30px" ,fontWeight:"600"}}>Số tiền bạn thanh toán  là : {sum.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
            })}</span>
           </div>
            <div>
                <h4 style={{ textAlign: "center", color: "white" ,fontWeight:"300" ,fontSize:"20px"}}>Điạ Chỉ</h4>
                <input name="address" value={address} onChange={(e) => {
                    onchangeInputAddress(e)
                }} size={50} style={{ height: "50px" }}></input>
            </div>
            <div >
                <h4 className='mt-5' style={{ textAlign: "center", color: "white" }}>Số điện thoại</h4>
                <input   maxLength={11}  onChange={(e) => {
                    onchangeInputAddress(e)
                }} name="tell" value={tell} min={0} max={15} size={20} type="tel" ></input>
            </div>
            <button onClick={() => submittheoder()} className='mt-3'>Đặt Hàng</button>
        </div>
        <div className='itemPayment2'>
            {listStorage.map((data, index, arr) => (
                <div key={index} className="childrenboxcart">
                    <img src={path + data.img} alt="ảnh pull" />
                    <h4 style={{fontWeight:"500" ,fontSize:"20px",marginLeft:"5px"}}>{data.title}</h4>
                    <div style={{ display: "flex", justifyContent:"center", alignItems:"center" }}>
                        <button style={{ width: "5rem", background: "#333", color: "white", border: "none", fontWeight: "bold" }} onClick={() => {
                        }}  >Số lượng</button>
                        <p style={{ textAlign: "center", fontWeight: "bold" ,border:"1px solid white" ,margin:"0px"}} >{data.quantily}</p>


                    </div>
                    <p style={{ width: "10rem" }}>{data.toltalmoney.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}</p>

                </div>

            ))}
        </div>
    </div>;
};



export default Payment; 
