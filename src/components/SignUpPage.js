import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import logo from "../images/Group899.png";
import "../styles/SignUpPage.css";

const SignUpPage = ({ onSignUp }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSignUpClick = async () => {
    try {
      const response = await fetch(`http://10.2.8.12:3002/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSignUp();

        navigate("/login");
      } else {
        console.error("Sign up failed:", data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="signUp-container">
      <div className="signUp-form">
        <img className="logo" src={logo} alt="Logo-here" />
        <div className="holder">
          <PersonOutlineOutlinedIcon className="user-icon" />
          <input
            type="text"
            placeholder="AUTHOR NAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
        </div>
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
        <div className="holder" style={{ textAlign: "center" }}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field"
            style={{ margin: "0 auto" }}
          >
            <option value="">Select Role</option>
            <option value="user">user</option>
            <option value="Annotator">Annotator</option>
            <option value="Reviewer">Reviewer</option>
          </select>
        </div>
        <button className="input-field" onClick={handleSignUpClick}>
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
