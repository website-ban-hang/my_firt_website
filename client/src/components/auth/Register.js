
import React, { useContext, useState } from 'react'
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import Form from "react-bootstrap/Form"
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Authcontext } from '../../contexts/Authcontext'
import AlertMessage from '../../View/AlertMessage'

const Register = () => {
    const history = useNavigate()
    const { authState: { isAuathenticated }, checkuseradm } = useContext(Authcontext)
    const data = useContext(Authcontext)
    const { registerUser } = data
    const [registerForm, setReegisterForm] = useState({
        username: "",
        password: "",
        confirmpassword: ""
    })
    const [alert, setalert] = useState(null)
    const onchangeRegisterform = e => (setReegisterForm({ ...registerForm, [e.target.name]: e.target.value }))
    const { username, password, confirmpassword } = registerForm

    const registerFormSubmit = async (e) => {

        e.preventDefault()
        if (password !== confirmpassword) {

            setalert({ type: "danger", message: "Mật khẩu không khớp" })
            setTimeout(() => {
                setalert(null)
            }, 700)
            return

        }
        if (username.length < 6) {
            return (
                setalert({ type: "danger", message: "Vui lòng nhập NAME Hoặc Mật khẩu trên 6 ký tự" }),
                setTimeout(() => {
                    setalert(null)
                }, 700)
            )
        }
        else if (password.length && confirmpassword.length < 6) {
            return (
                setalert({ type: "danger", message: "Vui lòng nhập NAME Hoặc Mật khẩu trên 6 ký tự" }),
                setTimeout(() => {
                    setalert(null)
                }, 700)
            )
        }
        try {
            const registerdata = await registerUser(registerForm)
            if (registerdata.success) {
                setTimeout(() => {
                    history("/dashboard")
                }, 1000)
            }
            else {
                setalert({ type: "danger", message: registerdata.message })
            }
        } catch (error) {
        }
    }
    if (isAuathenticated && checkuseradm !== true)
        return (<Navigate to="/dashboard"></Navigate>)
    else if (checkuseradm === true && isAuathenticated) {
        return (<Navigate to="/admin"></Navigate>)
    }
    return (
        <div className='landing' >
                     <Navbar bg="dark" variant="dark">
                        <Container>

                            <Nav className="me-auto" style={{ float: "right" }}>
                                <Link style={{color:"white" , textDecoration:"none"}} to="/returnguest" > Trang Chủ</Link>
                            </Nav>
                        </Container>
                    </Navbar>
            <div className='dark-overlay'>
                <div className='landing-inner'>
                    <Form onSubmit={registerFormSubmit}>
                        <AlertMessage info={alert}></AlertMessage>
                        <Form.Group className="mb-3" >
                            <Form.Control onChange={onchangeRegisterform} value={username} autoComplete='on' type="text" placeholder='Tên đăng nhập' name="username" required></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control onChange={onchangeRegisterform} value={password} autoComplete='on' required type="password" placeholder='Mật khẩu' name="password" ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Control onChange={onchangeRegisterform} value={confirmpassword} required autoComplete='on' type="password" placeholder='Nhập lại Mật Khẩu' name="confirmpassword" ></Form.Control>
                        </Form.Group  >
                        <Button className="mb-3" variant="success" type="submit">Đăng ký</Button>
                        <p> Bạn đã có tài khoản
                            <Link to="/login">
                                <Button variant="info" size="sm" className='ml-2'>  Đăng nhập</Button></Link>
                        </p>
                        <Outlet></Outlet>
                    </Form>
                </div>


            </div>
        </div>

    )

}

export default Register
