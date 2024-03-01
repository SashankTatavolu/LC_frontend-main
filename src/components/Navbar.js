import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../images/logo.png";
import menuImage from "../images/menu.png";
import profileImage from "../images/Profile.png";
import SidebarData from "./SidebarData";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Navbar.css";
// import "../styles/updated.css";

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={menuImage}
          alt="Menu"
          className="menu-icon"
          onClick={showSidebar}
        />
        <img src={logoImage} alt="Logo" className="logo" />
      </div>

      <div className="navbar-right">
        <img src={profileImage} alt="Profile" className="profile-icon" />
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <CloseIcon />
            </Link>
          </li>
          {SidebarData.map((item, index) => (
            <li key={index} className={item.cName}>
              <Link to={item.path}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </nav>
  );
};

export default Navbar;
