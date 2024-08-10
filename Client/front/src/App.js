import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Test from "./Components/Test";
import FirstPage from "./Pages/FirstPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PopUpSucess from "./Components/PopUpSucess";
import Profil from "./Pages/Profil";
import MapComponent from "../src/Components/MapComponent";
import ForgetPassword from "./Components/ForgetPassword";
import ResetPassword from "./Components/ResetPassword";
import Estimation from "./Components/Estimation";
import Admin from "./Components/Admin";
import Reservation from "./Components/Reservation";
import Position from "./Components/Position"; 
import Calender from "./Components/Calender"; 
import MyReservation from "./Components/MyReserv"; 
import StationInfos from "./Components/StationInfos";
import AdminDashboard from "./Components/AdminDashboard"; 
import Payment from "./Components/Payment"; 



function App() {
  
  return (
    <>
        <Router>
      <Routes>
      <Route path="/" element={<FirstPage/>} />
      <Route path="/SignUp" element={<SignUp/>} />
      <Route path="/Login" element={<Login/>} /> 
      <Route path="/confirm/:activationCode" element={<PopUpSucess />} />
      <Route path="/home/:id" element={<Profil/>} /> 
      <Route path="/MapComponent/:userId" element={<MapComponent/>} /> 
      <Route path="/Test" element={<Test/>} /> 
      <Route path="/forgetPassword" element={<ForgetPassword/>} /> 
      <Route path="/reset/:pwCode" element={<ResetPassword/>} /> 
      <Route path="/estimation" element={<Estimation/>} /> 
      <Route path="/Admin/:id" element={<Admin/>} /> 
      <Route path="/Reservation/:userId" element={<Reservation/>} /> 
      <Route path="/Position" element={<Position/>} /> 
      <Route path="/calender" element={<Calender/>} /> 
      <Route path="/MyReservation/:userId" element={<MyReservation/>} /> 
      <Route path="/StationData" element={<StationInfos/>} /> 
      <Route path="/adminDashboard" element={<AdminDashboard/>} /> 
      <Route path="/Payment/:id" element={<Payment/>} /> 

      </Routes>
    </Router>
   
       
    </>
  );
}

export default App;
