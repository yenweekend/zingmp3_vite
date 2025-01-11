import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children, route }) => {
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }
  return children;
};

export default ProtectedRoute;
