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

function App() {
  
  return (
    <>
        <Router>
      <Routes>
      <Route path="/" element={<FirstPage/>} />
      <Route path="/SignUp" element={<SignUp/>} />
      <Route path="/Login" element={<Login/>} /> 
      <Route path="/confirm/:activationCode" element={<PopUpSucess />} />
      <Route path="/home/" element={<Profil/>} /> 
      <Route path="/MapComponent" element={<MapComponent/>} /> 
      <Route path="/Test" element={<Test/>} /> 
      <Route path="/forgetPassword" element={<ForgetPassword/>} /> 
      <Route path="/reset/:pwCode" element={<ResetPassword/>} /> 
      </Routes>
    </Router>
   
       
    </>
  );
}

export default App;
