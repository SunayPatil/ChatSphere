import React, { useState, useEffect } from "react";

const UserContext = React.createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: () => {},
});

export default UserContext;

export const UserContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState({});
  const storedUserLoginInfo = localStorage.getItem("chatWebApp");
  useEffect(() => {
    if (storedUserLoginInfo) {
      setAdminData(JSON.parse(storedUserLoginInfo));
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (data) => {
    setAdminData(data);
    localStorage.setItem("chatWebApp", JSON.stringify(data));
    setIsLoggedIn(true);
  };
  const logoutHandler = () => {
    setAdminData({});
    localStorage.removeItem("chatWebApp");
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{
        adminData,
        isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
