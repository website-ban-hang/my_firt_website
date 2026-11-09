import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Nav, Navbar, Row, Spinner } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Authcontext } from '../../contexts/Authcontext'
import { storeContext } from '../../contexts/StoreContext'

const Returnguest = () => {
    const { authState: { isAuathenticated, authloading }, loginUer, checkuseradm, } = useContext(Authcontext)
    const { getListStore, getlistCartreturnguest, listpost, storeLoading } = useContext(storeContext)
    const data = listpost || [];
    const [currenPage, setcurrenPage] = useState(0);
    const [postPerPage, setpostPerPage] = useState(12);
    const newlistpost = data.slice(currenPage, postPerPage);
    const [newlist, setnewlist] = useState(newlistpost);
    const [status, setstatus] = useState(true);

    const pageNumber = [];

    const path = "http://localhost:3000/";
    const totalpost = Math.ceil(data.length / 10);
    for (let i = 0; i < totalpost; i++) {
        pageNumber.push(i);
    }
    const push = useNavigate()

    const PageNext = (number) => {
        const curren = number * 12
        setnewlist(data.slice(curren, curren + 12))
    };
    useEffect(() => {
        setnewlist(newlistpost)
            setstatus(false)
    }, [listpost])
    console.log(storeLoading ,status)
    if (storeLoading )
        return (<Spinner style={{ position: "fixed", marginBottom: "25%", marginLeft: "50%" }}
            className="landing-inner"
            animation="border"
            variant="info"
        ></Spinner>)
    if (isAuathenticated && checkuseradm !== true)
        return (<Navigate to="/dashboard"></Navigate>)
    else if (checkuseradm === true && isAuathenticated) {
        return (<Navigate to="/admin"></Navigate>)
    }

    return (
        <div className="containerHome mt-3">
            <Navbar bg="dark" variant="dark">
                <Container>

                    <Nav className="ms-auto" style={{ float: "right" }}>
                        <Link style={{ color: "white", textDecoration: "none" }} className="me-5" to="/login" > Đăng Nhập</Link>
                        <Link style={{ color: "white", textDecoration: "none" }} to="/register"> Đăng Ký</Link>
                    </Nav>
                </Container>
            </Navbar>

            <Row sm={5} >
                {newlist.map((data, index) => (

                    <Col onClick={()=>push("login")} className="mt-1 " style={{ height: "22rem", width: "14rem" }} key={index}>
                        <Card className="cart" style={{ maxHeight: "18rem", minHeight: "18rem", maxWidth: "13rem" }}>
                            <Card.Img
                                style={{ maxHeight: "10rem", minHeight: "10rem", maxWidth: "8rem", minWidth: "100%" }}
                                variant="top"
                                src={path + data.img}
                            />
                            <Card.Body>
                                <Card.Title className="texttile">{data.title} </Card.Title>
                                <Card.Text className="ellipsis" style={{ minHeight: "1rem" }}>
                                    {data.status}
                                </Card.Text>
                                <Card.Text style={{ maxHeight: "2rem" }} className="ellipsis2 ">
                                    {"Giá:" +
                                       (data.money ?? 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
})}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Button style={{ marginBottom: "15px" }} variant="success">
                            Thêm Vào Giỏ Hàng
                        </Button>
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

        </div>
    )
}

export default Returnguest