import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Router, useNavigate } from "react-router-dom";
import { PORT } from "../constants";
import { StoreReducer } from "../Reducers/StoreReducer";

export const storeContext = createContext()

const StoreProvider=({children})=>{
   const [storestate,dispath]=useReducer(StoreReducer,{
       storeLoading:true,
       listpost:"",
       detail:[],
       detaillCarLoading:true
   })
   const {listpost,storeLoading,detail,detaillCarLoading}=storestate


  const [alert, setalert] = useState(null)
   const send = async (data) => {
    try {
      setTimeout(() => {
        setalert(null)
       getListStore()
      }, 1000);
      const res = await axios.post(`${PORT}store`, data)
    } catch (error) {
      return setalert({message:"lỗi đăng tải"})
    }
  }
  const getListStore =async()=>{
      try {
          const repose = await axios.get(`${PORT}store/getlistCart`)
         dispath({type:"GET_LISTCART" ,payload:repose.data.list})
          return repose.data
      } catch (error) {
          console.log("lỗi ");
      }
  }
  const detailcart = async (data) => {
    dispath({ type: "GET_DETAILCART2", payload: detaillCarLoading });
    Findcartbyid(data._id || data.id);
    console.log(data)
  
  };
  const getlistCartreturnguest =async()=>{
    try {
        const repose = await axios.get(`${PORT}store/getlistCartreturnguest`)
       dispath({type:"GET_LISTCART" ,payload:repose.data.list})
        return repose.data
    } catch (error) {
        console.log("lỗi ");
    }
}

const EditCartItem2=async(dataformEdit,data)=>{
  console.log(dataformEdit);
try {
  const reponse = await axios.put(`${PORT}store/editcart/${dataformEdit._id}`,data)
  setalert({type:"success",message:"Cập Nhật Thành công"})
  setTimeout(() => {
    setalert(null)
    getListStore()
  },2000);

  if (reponse.data.succsess) {
    return reponse.data
  }
} catch (error) {
  console.log("lỗi upload từ StoreContext");
}
}
//Tìm một sản phẩm chi tiết 

const Findcartbyid =async(id)=>{


  try {
    const response = await axios.get(`${PORT}store/detailcart/${ id}`)
    dispath({type:"GET_DETAILCART",payload:{detail:response.data.detail,id,}})
  } catch (error) {
    
  }
}



 const deleteCartStore =async (id,newlist)=>{
 try {
  const reponse = await axios.delete(`http://localhost:3000/store/deletecart/${id}`)
   if(reponse.data.success)
   dispath({type:"DELETE_CART",payload:reponse.data.deletecard})

   return reponse.data
 } catch (error) {
   console.log("lỗi");
 }

 }
useEffect(()=>{getlistCartreturnguest()},[])


   const storeData={detailcart,getlistCartreturnguest,getListStore,send,alert,setalert,storeLoading,listpost,deleteCartStore,EditCartItem2,Findcartbyid,detail,detaillCarLoading,dispath}


   
   return (
       <storeContext.Provider value={storeData}>
           {children}
       </storeContext.Provider>
   )

}
export default StoreProvider

