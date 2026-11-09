import { createContext, useEffect, useReducer,useCallback } from "react"
import axios from "axios"
import { authReducer } from "../Reducers/authReducer"
import {PORT} from "../constants"
export const Authcontext = createContext()
const AtuthContextProvider = ({ children }) => {
    const [authState, dispath] = useReducer(authReducer, {
        authloading: true,
        isAuathenticated: false,
        user: "",
        checkuseradm: "",
        storeLoading:true,
    })
    const { checkuseradm,storeLoading } = authState
    //authentucate user
    const setAuthToken = token => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        }
        else {
            delete axios.defaults.headers.common["Authorization"]
        }
    }
    const loaduser = useCallback(async () => {
        if (localStorage["token"]) {
          setAuthToken(localStorage["token"]);
        }
      
        try {
          const resspone = await axios.get(`${PORT}auth/login`);
          if (resspone.data.success) {
            dispath({
              type: "SET_AUTH",
              payload: {
                isAuathenticated: true,
                user: resspone.data.user,
                checkuseradm: resspone.data.user.admin,
                storeLoading
              }
            });
          }
        } catch (error) {
          localStorage.removeItem("token");
          setAuthToken(null);
          dispath({
            type: "SET_AUTH",
            payload: { isAuathenticated: false, user: null }
          });
        }
      }, [storeLoading]);
    // const loaduser = async () => {
    //     if (localStorage["token"]) {
    //         setAuthToken(localStorage["token"])
    //     }
    //     try {
    //         const resspone = await axios.get(`${PORT}auth/login`)            
    //         if (resspone.data.success) {
    //             setTimeout(() => {
    //                 dispath({ type: "SET_AUTH", payload: { isAuathenticated: true, user: resspone.data.user, checkuseradm: resspone.data.user.admin,storeLoading } })
          
    //             }, 500);
    //         }

    //     } catch (error) {
    //         localStorage.removeItem("token")
    //         setAuthToken(null)
    //         dispath({ type: "SET_AUTH", payload: { isAuathenticated: false, user: null } })
    //     }
    // }
    //login
    const loginUer = async userrForm => {
        try {
            const response = await axios.post(`${PORT}auth/login`, userrForm)
            if (response.data.success)
                localStorage.setItem("token", response.data.accessToken)
            await loaduser()
            return response.data
        } catch (error) {
            if (error.response.data) return error.response.data
            else return { success: false, message: error.message }

        }
    }
    //logout
    const logoutUser = async () => {
        localStorage.removeItem("token")
        setAuthToken(null)
        dispath({ type: "SET_AUTH", payload: { isAuathenticated: false, user: null } })

    }
    //register
    const registerUser = async userrForm => {
        try {
            const response = await axios.post(`${PORT}auth/register`, userrForm)
            if (response.data.success)
                localStorage.setItem("token", response.data.accessToken)

            await loaduser()

            return response.data
        } catch (error) {
            if (error.response.data) return error.response.data
            else return { success: false, message: error.message }

        }
    }
    // chức năng  thêm admin hoặc thành viên 
    const registerUserADMIN = async userrForm => {
        try {
            const response = await axios.post(`${PORT}auth/register/admin`, userrForm)
            await  loaduser()
            return response.data
        } catch (error) {
            if (error.response.data) return error.response.data
            else return { success: false, message: error.message }

        }
    }
    //load user
    // useEffect(() => loaduser(), []) mới đóng lúc 24/03/2026
    useEffect(() => {
        loaduser();
      }, [loaduser]);
    const AuthcontextData = { loginUer, authState, registerUser, logoutUser, checkuseradm,registerUserADMIN,storeLoading }
    return (
        <Authcontext.Provider value={AuthcontextData}>
            {children}
        </Authcontext.Provider>
    )
}

export default AtuthContextProvider