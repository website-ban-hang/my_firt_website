import axios from "axios";
import { createContext, useEffect, useReducer } from "react";
import { PORT } from "../constants";
import { postReducer } from "../Reducers/postReducer";
export const PostContext = createContext()

const PostConTextProvider = ({ children }) => {
  const [postState, dispath] = useReducer(postReducer, {
    users: [],
    postloading: true,
    edituser: "",
  })
  const {postloading}=postState
  //Get tất cả  USer  ADmin
  const getUserAdm = async (setnewlist,currenPage) => {
    try {
      const response = await axios.get(`${PORT}auth/login/admin`)
      const { data: { user } } = response
      dispath({ type: "GET_USERADM", payload: user })
      return response.data
    } catch (error) {

    return { success: false, message: error.message }
    }
  }
  const actionEitUser = async (datas) => {
    try {
      const { username, admin,password} = datas
      
      const data = { username,password,admin  }
      const response = await axios.put(`${PORT}auth/${datas.id}`, data)
    dispath({type:"UPLOAD_LISTMEMBER",payload:response.data.post})
      if (response.data.succsess) {
        return response.data
      }
    } catch (error) {
      console.log("lỗi update")
    }

  }

  //xóa người dùng trong  admin
  const deleteUserAdm = async (id,setalert) => {
    try {
      const response = await axios.delete(`${PORT}post/admin/${id}`)
      const userHasDelete = response.data.userdlt
      dispath({ type: "DELETE_USER", payload: userHasDelete._id })
       getUserAdm()
      setalert({ type: "danger", message: "ĐÃ XÓA" })
      setTimeout(() => {
        setalert(null)
      }, 1000);
    } catch (error) {
    }
  }



  //Tìm ra  tài khoản cụ thể khi Đổi mật khẩu 
  const findpPost = edituserID => {
    const post = postState.edituser.find(post => post._id === edituserID)
    dispath({ type: "FIND_POST", payload: post })
  }
  const AuthcontextData = { deleteUserAdm, getUserAdm, postState, findpPost, actionEitUser,postloading }
  return (
    <PostContext.Provider value={AuthcontextData}>
      {children}
    </PostContext.Provider>
  )
}
export default PostConTextProvider