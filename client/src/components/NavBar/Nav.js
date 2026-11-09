import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import Home from "../auth/Home";
import { Authcontext } from "../../contexts/Authcontext";
import { Button, Spinner } from "react-bootstrap";
import img from "../../assets/logoutbug.jpeg";
import { IoIosCart } from "react-icons/io";
import { StorageCartContext } from "../../contexts/storagecartContext";
import { storeContext } from "../../contexts/StoreContext";
import axios from "axios";
import { PORT } from "../../constants";
const Nav = () => {
  const {
    authState: { isAuathenticated },
    checkuseradm,
    logoutUser,
    storeLoading,
  } = useContext(Authcontext);
  const { listStorage } = useContext(StorageCartContext)
  const index=listStorage.length
  const navigate = useNavigate();
  var newlistStorage2 = listStorage.slice().reverse();
  const newlistStorage = newlistStorage2.slice(0, 4)
  const { getlistCartreturnguest ,detaillCarLoading,listpost,} = useContext(storeContext)

  const path = "http://localhost:3000/";
  let body;

  if (storeLoading)
  return (<Spinner style={{ position: "fixed", marginBottom: "25%", marginLeft: "50%" }}
      className="landing-inner"
      animation="border"
      variant="info"
  ></Spinner>)
  body = (isAuathenticated===true && checkuseradm===false) ? (
    <div className="itemnavbar">
      <Button
        onClick={logoutUser}
        variant="danger"
        className="font-weight-bolder text-white "
        style={{
          padding: "0%",
          height: "3rem",
          background: "white",
          color: "black",
          float: "right",
          marginLeft: "auto",
        }}
      >
        <img
          src={img}
          alt="logoutIcon"
          width="45"
          height="38"
          className="mr-2 success"
        />
        <p></p>
      </Button>
      <button className="btnHomeDB">
        {" "}
        <Link style={{ color: "white" }} to="dashboard">
        Home
        </Link>
      </button>
      <button className="btnContact">
        {" "}
        <Link style={{ color: "white" }} to="cartoder">
         Đơn Đã Đặt
        </Link>
      </button>
      <button className="btnContact">
        {" "}
        <Link style={{ color: "white" }} to="contact">
          Liên hệ
        </Link>
      </button>



      <div className="cartbtn">
        {" "}
        <button onClick={() => navigate("/viewcart")}>
          {" "}
          <IoIosCart></IoIosCart>
        </button>
        <div className="indexStorage">{index}</div>

        <div className="showcart">
          <div className="containerShowcart">
            {newlistStorage.map((data, index) => (
              <div key={index} className="chidlrenshowcart">
                <img src={path + data.img} />
                <h4>{data.title}</h4>
                <p>{data.quantily} </p>
                <p>{data.toltalmoney}</p>
              </div>
            ))}


          </div>
          <button onClick={() => navigate("viewcart")} className="btnxemgiohang">Xem Giỏ Hàng</button>

        </div>
      </div>
    </div>
  ) : (
    <Navigate to="returnguest"></Navigate>
  );
  return (
    <div className="containerDashboard">
      <div className="navbardb">{body}</div>
      <Outlet></Outlet>
    </div>
  );
};

export default Nav;
