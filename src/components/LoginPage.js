import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import logo from "../images/Group899.png";

const LoginPage = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    try {
      const response = await fetch(`http://10.2.8.12:3002/login` ,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        console.log(data.token);

        

        // Navigate to the home page
        navigate("/projects");
      } else {
        console.error("Login failed:", data.message);
        // Handle login error here
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error here
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img className="logo" src={logo} alt="Logo-here" />
        {/* <h1>Login Page</h1> */}
        <div className="holder">
          <PersonOutlineOutlinedIcon className="user-icon" />
          <input
            type="text"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="holder">
          <HttpsOutlinedIcon className="user-icon" />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button className="input-field" onClick={handleLoginClick}>
          LOGIN
        </button>

        <div className="input-links">
          <Link to="/signup">Sign Up</Link>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
