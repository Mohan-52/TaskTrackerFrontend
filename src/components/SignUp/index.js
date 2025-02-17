import { useState } from "react";
import "./index.css";

const SignUp = (props) => {
  const { toggoleSignUp } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setTogglePwd] = useState(false);

  const submitForm = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const userDetails = { name, email, password: pwd };

    try {
      const response = await fetch(
        "https://tasktrackerbackend-x03u.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userDetails),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Signup successful! Please log in.");
        setName("");
        setEmail("");
        setPwd("");
      } else {
        setErrorMessage(data.message || "Signup failed.");
      }
    } catch (error) {
      console.log("Signup error:", error);
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="sing-up-con">
      <h2>Sign Up</h2>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={submitForm} className="form">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          type="password"
          id="pwd"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
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
          Create User
        </button>
        <button onClick={() => toggoleSignUp()} className="log-btns btn">
           Back To Login
        </button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default SignUp;
