import axios from "axios";
import { createContext, useReducer } from "react";
import { PORT } from "../constants";
import { storageCartreducer } from "../Reducers/StorageCartreducer";

export const StorageCartContext = createContext();

const StorageCartProvider = ({ children }) => {
  const [storageState, dispath] = useReducer(storageCartreducer, {
    storageLoading: false, listStorage: [], loadingquanlyti: false
  });
  const { loadingquanlyti, listStorage, storageLoading } = storageState;

  const addstorageCart = async (data, quantily, address) => {
    const newData = { ...data, quantily, address };
    try {
      const response = await axios.post(`${PORT}storagecart`, newData);
      await getStorageCart();
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const sendlistpayment = async (address, tell, recipient) => {
    try {
      const response = await axios.post(`${PORT}theoder`, { address, tell, recipient, listStorage });
      await getStorageCart();
      return response.data;
    } catch (error) {
      console.error("Không thể tạo đơn hàng:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const increasequantily = async (quanlity, id, money) => {
    dispath({ type: "SET_QUANLITY2", payload: true });
    const data = { quantily: quanlity, toltalmoney: quanlity * money };
    try {
      const response = await axios.put(`${PORT}storagecart/quantily/${id}`, data);
      dispath({ type: "UPDATE_STORAGE_QUANTITY", payload: { id, quantily: quanlity, toltalmoney: data.toltalmoney } });
      return response.data;
    } catch (error) {
      console.error("Không thể cập nhật số lượng:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    } finally {
      dispath({ type: "SET_QUANLITY2", payload: false });
    }
  };

  const deletesoragecart2 = async (id) => {
    try {
      const response = await axios.delete(`${PORT}storagecart/quantily/${id}`);
      await getStorageCart();
      dispath({ type: "DELETE_STORAGE", payload: response.data.deletesorage });
      return response.data;
    } catch (error) {
      console.error("Không thể xóa giỏ hàng:", error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const getStorageCart = async () => {
    try {
      const response = await axios.get(`${PORT}storagecart`);
      dispath({ type: "SET_LISTSTORAGE", payload: response.data.listStorage });
      return response.data;
    } catch (error) {
      console.error("Không thể tải giỏ hàng:", error);
      dispath({ type: "SET_LISTSTORAGE", payload: [] });
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const storagecartdata = {
    sendlistpayment, deletesoragecart2, addstorageCart, getStorageCart,
    listStorage, storageLoading, increasequantily, loadingquanlyti
  };
  return <StorageCartContext.Provider value={storagecartdata}>{children}</StorageCartContext.Provider>;
};
export default StorageCartProvider;
