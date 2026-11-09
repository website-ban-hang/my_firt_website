import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";
import { Router } from "react-router-dom";
import { PORT } from "../constants";
import { storageCartreducer } from "../Reducers/StorageCartreducer";


export const StorageCartContext = createContext()
const StorageCartProvider = ({ children }) => {
  const [storageState, dispath] = useReducer(storageCartreducer, {
    storageLoading: false,
    listStorage: [],
    loadingquanlyti: false,
  })
  const { loadingquanlyti } = storageState
  const { listStorage, storageLoading } = storageState
  const addstorageCart = (async (data, quantily, address) => {
    const newdadta = { ...data, quantily, address }
    try {
      const reponse = await axios.post(`${PORT}storagecart`, newdadta)
      await getStorageCart()

      return reponse.data
    } catch (error) {
      throw new error()
    }
  })

const sendlistpayment= async(address,tell)=>{
  const data= {address,tell,listStorage}
try {
  const response = await axios.post(`${PORT}theoder`,data)
  await getStorageCart()
  return response.data
} catch (error) {
  console.log(error);
}
}
  const increasequantily = async (quanlity, id, money) => {
    dispath({ type: "SET_QUANLITY2", payload: { loadingquanlyti: false } })
    const data = { quantily: quanlity, toltalmoney: quanlity * money }
    try {
      const response = await axios.put(`${PORT}storagecart/quantily/${id}`, data)
      await getStorageCart()
      dispath({ type: "SET_QUANLITY", payload: response.data.quantily })

      if (response.data.succsess) {
        return response.data
      }
    } catch (error) {
      console.log(error);
    }
  }
  const deletesoragecart2 = async (id) => {
    try {
      const response = await axios.delete(`${PORT}storagecart/quantily/${id}`)
      await getStorageCart()
      dispath({type:"DELETE_STORAGE",payload:response.data.deletesorage})
      return response.data
    } catch (error) {
console.log(error);
    }
  }
  const getStorageCart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/storagecart")
      dispath({ type: "SET_LISTSTORAGE", payload: response.data.listStorage })
      return response.data
    }
    catch (error) {
      return { success: false, message: error.message }
    }
  }

  const storagecartdata = {sendlistpayment, deletesoragecart2, addstorageCart, getStorageCart, listStorage, storageLoading, increasequantily, loadingquanlyti }
  return (
    <StorageCartContext.Provider value={storagecartdata}>
      {children}
    </StorageCartContext.Provider>

  )
}

export default StorageCartProvider
