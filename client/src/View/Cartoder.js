
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { PORT } from '../constants';
import { ListOderCOntext } from '../contexts/ListoderContext';
import { StorageCartContext } from '../contexts/storagecartContext';
const Cartoder = () => {
    // const [listtheoder, setlisttheoder] = useState([])
    const [detailcaroder, setdetailcaroder] = useState([])
    const [hidendetai, sethidendetai] = useState(false)
  const { getStorageCart } = useContext(StorageCartContext);

    const path = PORT;
    const { listtheoder, getlsitcartoder, loadingListoder } = useContext(ListOderCOntext)

    const btncaroder = async (id) => {

        try {
            const response = await axios.delete(`${PORT}theoder/${id}`)
            getlsitcartoder()
        } catch (error) {
            console.log(error);
        }
    }
    const showdetailcartoder = (id) => {
        setdetailcaroder(listtheoder.find(arr => arr._id === id).listOder.map(arr => arr))

    }
    useEffect(() => {
        getStorageCart() 
        getlsitcartoder()
    }, []);
    if (loadingListoder === true) {
        return <Spinner style={{ position: "fixed", marginBottom: "30%", marginLeft: "1%", right: "50%" }}
            className="landing-inner"
            animation="border"
            variant="info"
        ></Spinner>
    }
    return <div className='containerCartoder mt-5'>
        <div className='boxitem'>

            {listtheoder.map((data, index) => (
                <div className='itemcartoder' key={index}>
                    <p>STT: {++index}</p>
                    <p> số lượng :{data.listOder.length}</p>
                    <p>{(data.listOder.map((data2, number) => {
                        return data2.toltalmoney

                    })).reduce((total, number) => {
                        return total + number
                    }, 0).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}</p>

                    <p className={(data.status === true ? "successcaroder" : "failsuccessoder")}>{(data.status === false) ? "Đang Chờ xử lý" : "ĐÃ ĐẶT HÀNG"}</p>
                    <button className={(data.status === true) ? "btnsuccesscaroder" : "btnfailcaroder"} disabled={(data.status) === true ? true : false} onClick={() => btncaroder(data._id)}>{(data.status) === true ? "Thành Công" : "Hủy"}</button>
                    <button className='btnfailcaroder' onClick={(e) => {
                        showdetailcartoder(data._id)
                        sethidendetai(!hidendetai)
                        document.querySelector(".detailcartoder").style.display = ((hidendetai) ? "none" : "block");
                    }}>xem chi tiết</button>

                </div>
            ))}

        </div>
        <div className='detailcartoder' onMouseLeave={() => {
            sethidendetai(false)
            document.querySelector(".detailcartoder").style.display = "none"
        }}>
            {detailcaroder.map((data, index) => (
                <div key={index} className='chidlrendetaicartoder'>
                    <img src={`${path}${data.img}`}></img>
                    <p>Địa Chỉ: {data.address}</p>
                    <p>Số Lượng: {data.quantily}</p>
                    <p>Tổng Tiền: {data.toltalmoney}</p>

                </div>
            ))}


        </div>

    </div>;
};

export default Cartoder;
