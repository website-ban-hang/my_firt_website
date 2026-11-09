import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { PORT } from '../constants';
import { ListOderCOntext } from '../contexts/ListoderContext';

const Listorders = () => {
    const {listtheoder,getlsitcartoderadmin,loadingListoder}=useContext(ListOderCOntext)

    const [detailcaroder, setdetailcaroder] = useState([])
    const [hidendetai, sethidendetai] = useState(false)
    const [check,setcheck]=useState(false)
    const path = PORT;

    const showdetailcartoder =  (id) => {
        setdetailcaroder(listtheoder.find(arr => arr._id === id).listOder.map(arr => arr))
    }
    const btncaroder = async (id) => {
        try {
            const response = await axios.delete(`${PORT}theoder/${id}`)
            getlsitcartoderadmin()
        } catch (error) {
            console.log(error);
        }
    }
    const accepptsorecart = async (id) => {
        try {
            const reponse1 = await axios.put(`${PORT}theoder/${id}`, { status: true })
            getlsitcartoderadmin()
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getlsitcartoderadmin()
    },[])

    if(loadingListoder)
    return (<Spinner style={{ position: "fixed", marginBottom: "25%", marginLeft: "50%" }} className="landing-inner" animation="border" variant="info"></Spinner>)
    return <div className='containerlistorders'>
        {listtheoder.map((data, index) => (
            <div className='childrenlistorders' key={index}>
                <p>STT: {++index}</p>
                <p> số lượng :{data.listOder.length}</p>
                <p>Địa chỉ cụ thể:  {data.tell } , {detailcaroder.map((data, index) => (
data.address
            ))}</p>
                <p>{data.address}</p>

              <div style={{minWidth:"200px", maxWidth:"200px"}}>
              <p className={(data.status === true ? "successcaroder" : "failsuccessoder")}>{(data.status === false) ? "Đang Chờ xử lý" : "Đã Xác Nhận ĐƠn"}</p>
              </div>
                <div style={{minWidth:"200px"}}>
                    <button className={(data.status === true) ? "btnsuccesscaroder" : "btnfailcaroder"} disabled={(data.status) === true ? true : false} onClick={() => btncaroder(data._id)}>{(data.status) === true ? "Thành Công" : "Hủy"}</button>
                    <button hidden={(data.status === true) ? true : false} onClick={() => accepptsorecart(data._id)
                    } className='btnxacnhan' style={{ background: "black", color: "white", border: "none" }}>Xác Nhận</button>
                </div>
                <button className='detaibtncaroder' onClick={(e) => {
                    showdetailcartoder(data._id)
                    sethidendetai(!hidendetai)
                    document.querySelector(".detailcartoder").style.display = ((hidendetai) ? "none" : "block");
                }}>xem chi tiết</button>

            </div>

        ))}
        <div style={{ marginLeft: "10%" }} className='detailcartoder' onMouseLeave={() => {
            sethidendetai(false)
            document.querySelector(".detailcartoder").style.display = "none"
        }}>
            {detailcaroder.map((data, index) => (
                <div key={index} className='chidlrendetaicartoder'>
                    <img src={`${path}${data.img}`}></img>
                    <p>Địa Chỉ: {data.address}</p>
                    <p>Số Lượng: {data.quantily}</p>
                    <p>Tổng Tiền: {(data.toltalmoney).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                })}</p>
              


                </div>
            ))}


        </div>


    </div>;
};

export default Listorders;
