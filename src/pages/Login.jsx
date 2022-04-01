import { useState } from "react";
import "./Login.css";
import "./../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [userInfo, setUserInfo] = useState();
  const navigate = useNavigate();

  const handleButtonClicked = () => {
    axios
      .post(`https://623c6ee17efb5abea680cb7a.mockapi.io/login`, {
        username,
        password,
      })
      .then((res) => {
        setUserInfo(res.body);
        console.log(userInfo);
        navigate(`/`);
      });

    //
  };

  return (
    <div className="login">
      <h1 className="name-title-style">Kite</h1>
      <form className="form">
        <div className="input-container">
          <label> Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <label> Password </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-container"></div>
      </form>
      {/* onClick={this.handleButtonClicked.bind(this)} */}
      <button
        type="button"
        onClick={() => {
          handleButtonClicked();
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
