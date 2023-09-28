import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "./context";

const Protected = () => {
  const ctx = useContext(UserContext);
  return (
    <div>
      {ctx.isLoggedIn && <Outlet />}
      {!ctx.isLoggedIn && <Navigate to="/" />}
    </div>
  );
};

export default Protected;
