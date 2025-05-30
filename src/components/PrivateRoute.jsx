import { useAuth } from "../contexts/authContexts";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { userLoggedIn } = useAuth();
  return !userLoggedIn ? <Navigate to="/sign-in" /> : <Outlet />;
};

export default PrivateRoute;
