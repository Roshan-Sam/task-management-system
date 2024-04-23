import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
