import React, { useContext, useEffect } from 'react'
import { Button, Col, Toast } from 'react-bootstrap'
import { Authcontext } from '../../contexts/Authcontext'
import img from "../../assets/logoutbug.jpeg"


import { Link, Navigate, Outlet } from 'react-router-dom'
import { storeContext } from '../../contexts/StoreContext'
import { ListOderCOntext } from '../../contexts/ListoderContext'

const Admin = () => {
  const { listtheoder, getlsitcartoderadmin, loadingListoder } = useContext(ListOderCOntext)

    const { authState: { isAuathenticated }, checkuseradm, logoutUser } = useContext(Authcontext)

    useEffect(()=>{getlsitcartoderadmin()},[])

    if (isAuathenticated && checkuseradm === true)
        return (
            <div className='Navbaradmin'>
                <div className='navbarlink'>
                    <Button style={{ marginRight: "10px" }} variant="dark" >  <Link style={{ lineHeight: "20px", }} to="addmember"> Thêm ADMIN</Link></Button>
                    <Button style={{ marginRight: "10px" }} variant="dark">  <Link style={{ lineHeight: "20px", }} to="homeadmin">HOME</Link></Button>
                    <Button style={{ marginRight: "10px" }} variant="dark">  <Link style={{ lineHeight: "20px", }} to="listmember">LIST NGƯỜI DÙNG</Link></Button>
                    <Button style={{ marginRight: "10px" }} variant="dark">  <Link style={{ lineHeight: "20px", }} to="additem">Thêm Hàng</Link></Button>
                    <Button style={{ marginRight: "10px" }} variant="dark">  <Link style={{ lineHeight: "20px", }} to="listorders">Quản Lý Đơn Hàng</Link></Button>
                    <Button style={{ marginRight: "10px" }} variant="dark">  <Link style={{ lineHeight: "20px", }} to="statistical">Thống kê</Link></Button>
                    <Button style={{ marginRight: "10px" }} variant="dark">  <Link style={{ lineHeight: "20px", }} to="/admin">Trang Chủ</Link></Button>
                    <div style={{ right: "0", position: "absolute", float: "right", top: "-1px" }}>
                        <Button
                            onClick={logoutUser}
                            className='font-weight-bolder text-white'>
                            <img
                                placeholder='LOGOUT'
                                src={img}
                                alt='logoutIcon'
                                width='40'
                                height='38'
                                className='success'
                                />
                        </Button >
                    </div>
                </div>

                <Outlet ></Outlet>

            </div>
        )
    else return (<Navigate to="/login"></Navigate>)
}

export default Admin
