import React, { useContext } from "react";
import UserContext from "../../context";
import "./Header.css";

const Header = () => {
  const ctx = useContext(UserContext);
  const handleLogoutClick = () => {
    ctx.onLogout();
    navigate("/");
  };
  return (
    <div className="header-div">
      <header className="site-header">
        <div className="site-identity">
          <h4>ChatSphere</h4>
        </div>
        <nav className="site-navigation">
          <ul className="nav">
            <li onClick={handleLogoutClick}>Logout</li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
