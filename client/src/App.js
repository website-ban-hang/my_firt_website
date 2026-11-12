import React from "react";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import "./App.css";
import "./design-system.css";
import Admin from "./components/auth/Admin";
import Home from "./components/auth/Home";
import AddItem from "./components/auth/interfaceAdmin/AddItem";
import AddMember from "./components/auth/interfaceAdmin/AddMember";
import Detailcrat from "./components/auth/interfaceAdmin/Detailcrat";
import Listmember from "./components/auth/interfaceAdmin/Listmember";
import LoginForm from "./components/auth/LoginForm";
import Register from "./components/auth/Register";
import Contact from "./components/NavBar/Contact";
import AtuthContextProvider, { Authcontext } from "./contexts/Authcontext";
import PostConTextProvider from "./contexts/PostContext";
import StoreProvider from "./contexts/StoreContext";
import StorageCartProvider from "./contexts/storagecartContext";
import Viewcart from "./View/viewcart";
import Payment from "./components/pages/Payment";
import AccountPage from "./components/pages/AccountPage";
import Finishedoder from "./View/Finishedoder";
import Cartoder from "./View/Cartoder";
import Listorders from "./View/Listorders";
import ListoderContextProvider from "./contexts/ListoderContext";
import Statistical from "./View/Statistical";
import Returnguest from "./components/returnguest/Returnguest";

function RequireCustomer({ children }) {
  const { authState: { authloading, isAuathenticated }, checkuseradm } = React.useContext(Authcontext);
  const location = useLocation();
  if (authloading) return <div className="ha-route-loading"><Spinner animation="border" /><span>Đang kiểm tra phiên đăng nhập...</span></div>;
  if (!isAuathenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (checkuseradm === true) return <Navigate to="/admin" replace />;
  return children;
}

function LegacyProductRedirect() {
  const { id } = useParams();
  return <Navigate to={"/products/" + id} replace />;
}

function AppRoutes() {
  const location = useLocation();
  const showGlobalHomeLink = location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/admin/additem";
  return (
    <>
      {showGlobalHomeLink && (
        <Link to="/" className="global-home-link" aria-label="Quay về trang chủ">
          <span aria-hidden="true">⌂</span>
          <span>Trang chủ</span>
        </Link>
      )}
      <Routes>
      <Route path="/" element={<Returnguest />} />
      <Route path="/products/:id" element={<Detailcrat />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/returnguest" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/dashboard/:id" element={<LegacyProductRedirect />} />
      <Route path="/account" element={<RequireCustomer><AccountPage /></RequireCustomer>} />
      <Route path="/viewcart" element={<RequireCustomer><Viewcart /></RequireCustomer>} />
      <Route path="/payment" element={<RequireCustomer><Payment /></RequireCustomer>} />
      <Route path="/cartoder" element={<RequireCustomer><Cartoder /></RequireCustomer>} />
      <Route path="/finishedoder" element={<RequireCustomer><Finishedoder /></RequireCustomer>} />
      <Route path="/admin" element={<Admin />}>
        <Route index element={<Navigate to="homeadmin" replace />} />
        <Route path="addmember" element={<AddMember />} />
        <Route path="homeadmin" element={<Home />} />
        <Route path="additem" element={<AddItem />} />
        <Route path="listorders" element={<Listorders />} />
        <Route path="listmember" element={<Listmember />} />
        <Route path="statistical" element={<Statistical />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <StoreProvider>
      <AtuthContextProvider>
        <PostConTextProvider>
          <StorageCartProvider>
            <ListoderContextProvider>
              <AppRoutes />
            </ListoderContextProvider>
          </StorageCartProvider>
        </PostConTextProvider>
      </AtuthContextProvider>
    </StoreProvider>
  );
}

export default App;
