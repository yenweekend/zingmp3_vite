import React from "react";
import { Navigate } from "react-router-dom";
const DefaultRoute = ({ route }) => {
  return <Navigate to={route} replace />;
};

export default DefaultRoute;
