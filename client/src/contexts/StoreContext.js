import axios from "axios";
import { createContext, useEffect, useReducer, useState } from "react";
import { PORT } from "../constants";
import { StoreReducer } from "../Reducers/StoreReducer";

export const storeContext = createContext();

const StoreProvider = ({ children }) => {
  const [storestate, dispath] = useReducer(StoreReducer, {
    storeLoading: true,
    listpost: "",
    detail: [],
    detaillCarLoading: true
  });
  const { listpost, storeLoading, detail, detaillCarLoading } = storestate;
  const [alert, setalert] = useState(null);

  const send = async (data) => {
    try {
      const response = await axios.post(`${PORT}store`, data);
      await getListStore();
      setalert({ type: "success", message: response.data.message || "Thêm sản phẩm thành công" });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Không thể tải ảnh hoặc lưu sản phẩm";
      setalert({ type: "danger", message });
      return { success: false, message };
    }
  };

  const getListStore = async () => {
    try {
      const response = await axios.get(`${PORT}store/getlistCart`);
      dispath({ type: "GET_LISTCART", payload: response.data.list });
      return response.data;
    } catch (error) {
      console.error("Không thể tải danh sách sản phẩm:", error);
      return { success: false, message: error.message };
    }
  };

  const detailcart = async (data) => {
    dispath({ type: "GET_DETAILCART2", payload: detaillCarLoading });
    return Findcartbyid(data._id || data.id);
  };

  const getlistCartreturnguest = async () => {
    try {
      const response = await axios.get(`${PORT}store/getlistCartreturnguest`);
      dispath({ type: "GET_LISTCART", payload: response.data.list });
      return response.data;
    } catch (error) {
      console.error("Không thể tải sản phẩm cho khách:", error);
      return { success: false, message: error.message };
    }
  };

  const EditCartItem2 = async (dataformEdit, data) => {
    try {
      const response = await axios.put(`${PORT}store/editcart/${dataformEdit._id}`, data);
      setalert({ type: "success", message: "Cập Nhật Thành công" });
      setTimeout(() => {
        setalert(null);
        getListStore();
      }, 2000);
      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      setalert({ type: "danger", message: "Không thể cập nhật sản phẩm" });
      return { success: false, message: error.message };
    }
  };

  const Findcartbyid = async (id) => {
    try {
      const response = await axios.get(`${PORT}store/detailcart/${id}`);
      dispath({ type: "GET_DETAILCART", payload: { detail: response.data.detail, id } });
      return response.data;
    } catch (error) {
      console.error("Không thể tải chi tiết sản phẩm:", error);
      return { success: false, message: error.message };
    }
  };

  const deleteCartStore = async (id) => {
    try {
      const response = await axios.delete(`${PORT}store/deletecart/${id}`);
      if (response.data.success) {
        dispath({ type: "DELETE_CART", payload: response.data.deletecard });
      }
      return response.data;
    } catch (error) {
      console.error("Không thể xóa sản phẩm:", error);
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    getlistCartreturnguest();
  }, []);

  const storeData = {
    detailcart, getlistCartreturnguest, getListStore, send, alert, setalert,
    storeLoading, listpost, deleteCartStore, EditCartItem2, Findcartbyid,
    detail, detaillCarLoading, dispath
  };

  return (
    <storeContext.Provider value={storeData}>
      {children}
    </storeContext.Provider>
  );
};

export default StoreProvider;
