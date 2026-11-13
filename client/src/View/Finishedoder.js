import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Finishedoder = () => {
  const push = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      push("/");
    }, 1000);

    return () => clearTimeout(redirectTimer);
  }, [push]);

  return (
    <div className="containerfinishoder d-flex flex-column">
      <Spinner
        className="finish-order-spinner"
        animation="border"
        variant="info"
        role="status"
        aria-label="Đang hoàn tất đặt hàng"
        style={{
          width: "1.25rem",
          height: "1.25rem",
          borderWidth: "0.16em",
          margin: "0 0 14px",
          flex: "0 0 auto"
        }}
      />
      <div className="textfinishoder">
        <h1>Đặt hàng thành công</h1>
        <h1>Cảm ơn bạn đã mua sắm tại Hoàng Ánh Điện Máy</h1>
      </div>
    </div>
  );
};

export default Finishedoder;
