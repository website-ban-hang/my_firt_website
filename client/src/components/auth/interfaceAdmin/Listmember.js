import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Authcontext } from '../../../contexts/Authcontext'
import { PostContext } from '../../../contexts/PostContext'
import AlertMessage from "../../../View/AlertMessage"

const Listmember = () => {
  const { authState: { user } } = useContext(Authcontext)
  const { deleteUserAdm, postState, getUserAdm, postState: { postloading }, actionEitUser } = useContext(PostContext)
  const { users } = postState
  const [alert, setalert] = useState(null)
  const [closeModal, setCloseModal] = useState(false)
  const [UpdateUSER, setUpdateUSER] = useState({
    username: "",
    admin: "",
    password: "",
    confirmpassword:""
  })


  const closeModalFS = (data) => {
    setCloseModal(false)

  }
  const { username, password, admin ,confirmpassword} = UpdateUSER

  const onchangeUpDateUer = (e) => {
    setUpdateUSER({ ...UpdateUSER, [e.target.name]: e.target.value })
  }

  const formUpdate = (e, data) => {
    setUpdateUSER({ ...UpdateUSER, [e.target.name]: e.target.value, username: data.username, admin: data.admin, id: data._id })
    setCloseModal(true)

  }

  const newsuers = users.slice().reverse()
  const [currenPage, setcurrenPage] = useState(0);
  const [postPerPage, setpostPerPage] = useState(8);
  let newlistpost = newsuers.slice(currenPage, postPerPage);
  const [newlist, setnewlist] = useState(0);
  const pageNumber = [];
  const totalpost = Math.ceil(users.length / 7);
  for (let i = 0; i < totalpost; i++) {
    pageNumber.push(i);
  }
  const PageNext = (number) => {
     const setCurrn=number*8
    setcurrenPage(setCurrn)
    setpostPerPage(setCurrn + 8)
    newlistpost= users.slice(currenPage, postPerPage);
  };

  const formsubmit = (e) => {
    e.preventDefault()
    if(confirmpassword!=password ) return  (
      setalert({ type: "danger", message: "mật khẩu không khớp" }),
      setTimeout(()=>{ setalert(null)},1000)
    )

    setCloseModal(false)
    actionEitUser(UpdateUSER)
    setalert({ type: "success", message: "THAY ĐỔI THÔNG TIN THÀNH CÔNG" })
    setTimeout(() => {
      setalert(null)
    }, 1500);
  }

  useEffect( ()=>{ 
      getUserAdm(setnewlist,currenPage)
},[])
  if (postloading)
    return (<Spinner style={{position:"fixed",marginBottom:"25%" ,marginLeft:"50%"}} className="landing-inner" animation="border" variant="info"></Spinner>)
  return (
    <div>
      <Container  style={{position:"relative"}}>
        <AlertMessage info={alert}></AlertMessage>

        {newlistpost.map((data, index) => (
    
          <Row className='mt-3 listmember' key={index} style={{ color: "white" }}>
            <Modal  show={closeModal} animation={false} onHide={closeModalFS}>
             <div className='dark-overlay'  >
             <AlertMessage info={alert}></AlertMessage>
             <Modal.Header closeButton> 
            
                <Modal.Title>Thay Đổi mật Khẩu</Modal.Title>
           
              </Modal.Header>
              <Form  >
                <Modal.Body>
                  <Form.Group>
                    <p>TÊN ĐĂNG NHẬP</p>
                    <Form.Control autoComplete='on' disabled value={username} onChange={onchangeUpDateUer} type="text" placeholder="Tên dăng nhập" name="username"  ></Form.Control>
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <div>Mật khẩu Mới</div>
                    <Form.Control autoComplete='on' value={password} onChange={onchangeUpDateUer} type="password" row={3} placeholder="Mật Khẩu" name="password" ></Form.Control>
                  </Form.Group>
                  <Form.Group className='mt-3'>
                    <p>Nhập lại mật khẩu Mới</p>
                    <Form.Control autoComplete='on' as="input" type="password" onChange={onchangeUpDateUer} value={confirmpassword} row={3} placeholder="Nhập Lại mật khẩu" name="confirmpassword"  ></Form.Control>
                  </Form.Group>
                  <Form.Group className="mt-3">
                    <p>CHỨC VỤ</p>
                    <Form.Control disabled={username==="xuanhieu"} as="select" name="admin" value={admin} onChange={onchangeUpDateUer} >
                      <option value={true}> ADMIN</option>
                      <option value={false}> Thành Viên</option>
                    </Form.Control>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={closeModalFS}  > Hủy Bỏ</Button>
                  <Button variant="success" onClick={formsubmit}> XÁC NHẬN</Button>
                </Modal.Footer>
              </Form>
             </div>
            </Modal>
            <Col className={(data.username === user.username) ? "COLORTEXTADM" : ""} ><p className={data.username === "xuanhieu" ? "colorxuanhieu" : ""}>{data.username}</p></Col>
            <Col ><p>{data.createAt}</p></Col>
            <Col className={((data.admin === true) ? "coloradmin" : "colormember")}  ><p >{((data.admin) === true ? "ADMIN" : "THÀNH VIÊN")}</p></Col>
            <Col >
              <Row  >
                <Col><Button variant='warning' disabled={(data.admin===true&&user.username!=="xuanhieu" )?true:false}   onClick={((e) => formUpdate(e,data))} >Sửa</Button></Col>
                <Col><Button variant='danger' onClick={(() => { deleteUserAdm(data._id) })} >Xóa</Button></Col> </Row>
            </Col>
          </Row>
        ))}

      </Container>
      <div className="divPagesListMember">
                {pageNumber.map((number, index) => (

                  <Link
                    onClick={() => PageNext(number)}
                    key={index}
                    to="#"
                    className="PagesListMember"
                  >
                    {number + 1}
                  </Link>

                ))}</div>
    </div>

  )
}

export default Listmember
