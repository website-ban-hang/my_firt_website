import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const Finishedoder = () => {
    const push=useNavigate()
    
  useEffect(() => {
   setTimeout(() => {
    push("/login")
   }, 1000);
  }, []);
    return <div className='containerfinishoder'>
   <Spinner style={{position:"fixed", marginBottom: "30%", marginLeft: "1%" }}
                className="landing-inner"
                animation="border"
                variant="info"
            ></Spinner>
        <div className='textfinishoder'>
            <h1>Đặt hàng thành công</h1>
            <h1>Vui lòng Chờ để quay lại trang chủ</h1>
        </div>
        
    </div>;
};

export default Finishedoder;
