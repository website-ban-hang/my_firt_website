import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Authcontext } from '../../../contexts/Authcontext'
import AlertMessage from '../../../View/AlertMessage'

const AddMember = () => {
    const { authState: { isAuathenticated }, checkuseradm, registerUserADMIN } = useContext(Authcontext)
    const history = useNavigate()
    const [alert, setalert] = useState(null)
    const [registerForm, setReegisterForm] = useState({
        username: "",
        password: "",
        confirmpassword: "",
        admin: false
    })
    const { password, username, confirmpassword, admin } = registerForm

    const submitADMIN = async (e) => {
        e.preventDefault()
        setReegisterForm({ ...registerForm, })
        if(password!==confirmpassword){
        setalert({ type: "danger", message: "MẬt KHẨU NHẬP LẠI CHƯA ĐÚNG"})
        return    setTimeout(() => {
                setalert(null)
            }, 800);
        }
        try {
            const registerdata = await registerUserADMIN(registerForm)
            if (registerdata.success) {
                setalert({ type: "success", message: registerdata.message })
               setTimeout(() => {
                    setalert(null)
                }, 1000);
            }
            else {
                setalert({ type: "danger", message: registerdata.message })
            }
        } catch (error) {
            console.log("lỗi")
        }

    }
    const onchangaddmember = (e) => {
        setReegisterForm({ ...registerForm, [e.target.name]: e.target.value })
    }
    if (isAuathenticated && checkuseradm === true)
        return (
   
                <div className='dark-overlay'>
                    <div className='landing-inner'>
                        <Form onSubmit={submitADMIN} >
                            <AlertMessage info={alert}></AlertMessage>
                            <Form.Group className="mb-3" >
                                <Form.Control onChange={onchangaddmember} value={username} autoComplete='on' type="text" placeholder='TÊN NGƯỜI DÙNG' name="username" ></Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control onChange={onchangaddmember} value={password} autoComplete='on' type="password" placeholder='Mật khẩu' name="password" ></Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Control onChange={onchangaddmember} value={confirmpassword} required autoComplete='on' type="password" placeholder='Nhập lại Mật Khẩu' name="confirmpassword" ></Form.Control>
                            </Form.Group  >
                            <Form.Group>
                                <Form.Label>CHỨC VỤ </Form.Label>
                                <Form.Control onChange={onchangaddmember} name="admin" required as="select" value={admin}>
                                    <option hidden key={'empty'} >CHỌN PHẦN QUYỀN</option>
                                    <option key={'1'} value={(true)}>ADMIN</option>
                                    <option key={'2'} value={(false)}>THÀNH VIÊN</option>
                                </Form.Control>
                            </Form.Group>
                            <Button className="mb-3" variant="success" type="submit">Thêm </Button>
                            <p> BẠN MUỐN QUAY LẠI TRANG CHÍNH?
                                <Link to="/admin">
                                    <Button variant="info" size="sm" className='ml-2'> TRANG CHỦ</Button></Link>
                            </p>
                            <Outlet></Outlet>
                        </Form>
                    </div>


                </div>
        )
    return (
        history("/admin")
    )
}

export default AddMember
