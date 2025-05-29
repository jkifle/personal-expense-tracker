import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return !currentUser ? <Navigate to="/sign-in" /> : <Outlet />;
};

export default PrivateRoute;
