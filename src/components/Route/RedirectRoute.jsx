import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isLoginSelector } from "../../redux/auth/selector";
const RedirectRoute = ({ children }) => {
  const isLogin = useSelector(isLoginSelector);
  return isLogin ? <Navigate to="/" replace /> : children;
};

export default RedirectRoute;
