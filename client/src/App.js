import { Navigate, Route, Routes } from "react-router-dom";
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
import Nav from "./components/NavBar/Nav";
import AtuthContextProvider from "./contexts/Authcontext";
import PostConTextProvider from "./contexts/PostContext";
import StoreProvider from "./contexts/StoreContext";
import Dashboard from "./View/Dashboard";
import StorageCartProvider from "./contexts/storagecartContext"
import Viewcart from "./View/viewcart";
import Payment from "./components/pages/Payment";
import Finishedoder from "./View/Finishedoder";
import Cartoder from "./View/Cartoder";
import Listorders from "./View/Listorders";
import ListoderContextProvider from "./contexts/ListoderContext";
import Statistical from "./View/Statistical";
import Returnguest from "./components/returnguest/Returnguest";
function App() {
  return (
    <StoreProvider>
      <AtuthContextProvider>
        <PostConTextProvider>
          <StorageCartProvider>
            <ListoderContextProvider>
              <Routes>
                <Route path="/" element={<Nav></Nav>}>
                  <Route path="dashboard" element={<Dashboard></Dashboard>}> </Route>
                  <Route path="/dashboard/:id" element={<Detailcrat></Detailcrat>}></Route>
                  <Route path="contact" element={<Contact></Contact>}> </Route>
                  <Route path="viewcart" element={<Viewcart></Viewcart>}> </Route>
                  <Route path="payment" element={<Payment></Payment>}> </Route>
                  <Route path="cartoder" element={<Cartoder></Cartoder>}> </Route>
                  <Route path="finishedoder" element={<Finishedoder></Finishedoder>}> </Route>
                  <Route path="*" element={<Navigate to="login"></Navigate>}></Route>
                
                </Route>
              
                <Route path="/login" element={<LoginForm></LoginForm>}>  </Route>
                <Route path="/register" element={<Register></Register>}></Route>
                <Route path="returnguest" element={<Returnguest></Returnguest>}></Route>
                <Route path="/admin" element={<Admin></Admin>}>
                  <Route index element={<Navigate to="homeadmin" replace />} />
                  <Route path="addmember" element={<AddMember></AddMember>}></Route>
                  <Route path="homeadmin" element={<Home></Home>}></Route>
                  <Route path="additem" element={<AddItem></AddItem>}></Route>
                  <Route path="listorders" element={<Listorders></Listorders>}></Route>
                  <Route path="listmember" element={<Listmember></Listmember>}></Route>
                  <Route path="statistical" element={<Statistical></Statistical>}></Route>
                </Route>
              </Routes>
            </ListoderContextProvider>
          </StorageCartProvider>
        </PostConTextProvider>
      </AtuthContextProvider>
    </StoreProvider>
  );


}

export default App;
