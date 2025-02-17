import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";
const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  return (
    <nav className="header">
      <img src="/task-logo.png" alt="Logo" className="logo" />
      <ul>
        <li>
          <Link to="/" className="link">
            {" "}
            Home{" "}
          </Link>{" "}
        </li>
        <li>
          <button onClick={logout} className="outLine-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
