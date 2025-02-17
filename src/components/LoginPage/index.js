import { useState } from "react";
import SignUp from "../SignUp";
import "./index.css";
import Cookies from "js-cookie";
import { useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSignup, setSignUp] = useState(false);
  const [showPassword, setTogglePwd] = useState(false);

  const navigate = useNavigate();

  const onSubmitSucess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
      path: "/",
    });
    navigate("/");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const userDetails = {
      email,
      password,
    };

    const apiUrl = "https://tasktrackerbackend-x03u.onrender.com/login";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(apiUrl, options);

      if (response.ok) {
        const data = await response.json();
        const { jwtToken } = data;
        onSubmitSucess(jwtToken);
      } else {
        setErrorMessage("Invalid Email or Password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggoleSignUp = () => {
    setSignUp((prevState) => !prevState);
  };

  const renderLoginForm = () => (
    <div className="form-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="pwd">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="pwd"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="show-pwd-con">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setTogglePwd((prevState) => !prevState)}
            id="checkBox"
          />
          <label htmlFor="checkBox" className="show-label">
            Show Password
          </label>
        </div>

        <button type="submit" className="log-btns btn">
          Login
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={toggoleSignUp} className="log-btns">
          Sign Up
        </button>
      </p>
      {errorMessage && <p className="error-para">{errorMessage}</p>}
    </div>
  );

  const jwtToken = Cookies.get("jwt_token");

  if (jwtToken) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-page-con">
      {showSignup ? (
        <SignUp toggoleSignUp={toggoleSignUp} />
      ) : (
        renderLoginForm()
      )}
    </div>
  );
};

export default Login;
