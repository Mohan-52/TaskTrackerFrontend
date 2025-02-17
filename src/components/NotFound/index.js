import Header from "../Header";
import "./index.css";

const NotFound = () => {
  return (
    <>
      <Header />
      <div className="not-fond-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png"
          className="not-img"
          alt="not-found-img"
        />
        <h1>Page Not Found</h1>
      </div>
    </>
  );
};

export default NotFound;
