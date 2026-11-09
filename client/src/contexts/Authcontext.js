import { createContext, useEffect, useReducer, useCallback } from "react";
import axios from "axios";
import { authReducer } from "../Reducers/authReducer";
import { PORT } from "../constants";

export const Authcontext = createContext();

const AtuthContextProvider = ({ children }) => {
  const [authState, dispath] = useReducer(authReducer, {
    authloading: true,
    isAuathenticated: false,
    user: null,
    checkuseradm: false,
    storeLoading: true,
  });
  const { checkuseradm, storeLoading } = authState;

  const setAuthToken = (token) => {
    if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete axios.defaults.headers.common.Authorization;
  };

  const loaduser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthToken(null);
      dispath({ type: "SET_AUTH", payload: { isAuathenticated: false, user: null, checkuseradm: false } });
      return { success: false, message: "Chưa đăng nhập" };
    }

    setAuthToken(token);
    try {
      const response = await axios.get(`${PORT}auth/login`);
      if (response.data.success) {
        dispath({
          type: "SET_AUTH",
          payload: {
            isAuathenticated: true,
            user: response.data.user,
            checkuseradm: response.data.user.admin,
            storeLoading,
          },
        });
      }
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      // Only discard credentials when the server explicitly rejects the token.
      // A 5xx/network failure must not unexpectedly log the user out.
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        setAuthToken(null);
        dispath({ type: "SET_AUTH", payload: { isAuathenticated: false, user: null, checkuseradm: false } });
      } else {
        dispath({ type: "AUTH_CHECK_FAILED" });
      }
      return { success: false, message: error.response?.data?.message || error.message || "Không thể kiểm tra đăng nhập" };
    }
  }, [storeLoading]);

  const getErrorResponse = (error) => ({
    success: false,
    message: error.response?.data?.message || error.message || "Đã xảy ra lỗi",
  });

  const loginUer = async (userrForm) => {
    try {
      const response = await axios.post(`${PORT}auth/login`, userrForm);
      if (response.data.success) {
        localStorage.setItem("token", response.data.accessToken);
        setAuthToken(response.data.accessToken);
        await loaduser();
      }
      return response.data;
    } catch (error) {
      return getErrorResponse(error);
    }
  };

  const logoutUser = async () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    dispath({ type: "SET_AUTH", payload: { isAuathenticated: false, user: null, checkuseradm: false } });
  };

  const registerUser = async (userrForm) => {
    try {
      const response = await axios.post(`${PORT}auth/register`, userrForm);
      if (response.data.success) {
        localStorage.setItem("token", response.data.accessToken);
        setAuthToken(response.data.accessToken);
        await loaduser();
      }
      return response.data;
    } catch (error) {
      return getErrorResponse(error);
    }
  };

  const registerUserADMIN = async (userrForm) => {
    try {
      const response = await axios.post(`${PORT}auth/register/admin`, userrForm);
      return response.data;
    } catch (error) {
      return getErrorResponse(error);
    }
  };

  useEffect(() => {
    loaduser();
  }, [loaduser]);

  const AuthcontextData = {
    loginUer, authState, registerUser, logoutUser, checkuseradm,
    registerUserADMIN, storeLoading,
  };

  return <Authcontext.Provider value={AuthcontextData}>{children}</Authcontext.Provider>;
};

export default AtuthContextProvider;
