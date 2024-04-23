import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PrivateRoute from "./components/PrivateRoute";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const TokenVerify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}verifytoken/`,
          {
            headers: { Authorization: `Bearer ${Cookies.get("token")}` },
          }
        );
        console.log(res.data);
      } catch (error) {
        if (
          error.response.data.messages[0].message ===
          "Token is invalid or expired"
        ) {
          navigate("/login");
        }
      }
    };
    TokenVerify();
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />

          <Route path="/userdashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
