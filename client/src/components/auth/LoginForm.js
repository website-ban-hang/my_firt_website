import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Nav, Navbar, Spinner, } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import { Link, Navigate, useNavigate, } from 'react-router-dom'
import { Authcontext } from '../../contexts/Authcontext'
import { StorageCartContext } from '../../contexts/storagecartContext'
import { storeContext } from '../../contexts/StoreContext'
import AlertMessage from '../../View/AlertMessage'
const LoginForm = () => {
    const { authState: { isAuathenticated, authloading }, loginUer, checkuseradm, } = useContext(Authcontext)
    let history = useNavigate()
    const [loginForm, setLoginForm] = useState({
        username: "",
        password: "",
    })
    const [alert, setalert] = useState(null)
    const onChangeLoginForm = e => (setLoginForm({ ...loginForm, [e.target.name]: e.target.value }))
    const { username, password } = loginForm
    const { getStorageCart } = useContext(StorageCartContext);
    const { getListStore,listpost } = useContext(storeContext)
    const login = async (e) => {
        e.preventDefault()
        try {
            const logindata = await loginUer(loginForm)
            if (logindata.success) {
                getStorageCart()
                 getListStore()
                history("/dashboard")
            }
            else {
                setalert({ type: "danger", message: logindata.message })
                setTimeout(() => {
                    setalert(null)
                }, 3000);
            }
        } catch (error) {
            console.log("lỗi sever")
        }
    }

    if (authloading)
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

        <div className='landing' >
            <div className='dark-overlay'>
            <Navbar bg="dark" variant="dark">
                        <Container>

                            <Nav className="me-auto" style={{ float: "right" }}>
                                <Link style={{color:"white" , textDecoration:"none"}} to="/returnguest" > Trang Chủ</Link>
                            </Nav>
                        </Container>
                    </Navbar>
                <div className='landing-inner'>
           
                    <Form onSubmit={login} >
                        <AlertMessage info={alert}></AlertMessage>
                        <Form.Group className="mb-3">
                            <Form.Control onChange={onChangeLoginForm} value={username} type="text" placeholder='Username' name="username" required autoComplete='on'></Form.Control>
                        </Form.Group>

                        <Form.Group className='mb-3' >
                            <Form.Control onChange={onChangeLoginForm} value={password} type="password" placeholder='Password' name="password" required autoComplete='on'></Form.Control>
                        </Form.Group >
                        <Button className="mb-3" type="submit" variant="secondary"  >Login</Button>
                        <p>Nếu bạn chưa có tài khoản
                            <Link to="/register">
                                <Button size="sm" className='ml-2' variant="secondary"  >  đăng ký</Button></Link>
                        </p>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
