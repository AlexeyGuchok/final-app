import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import config from "../config/default";

export const Navbar = ({ theme, changeTheme }) => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push("/");
  };

  return (
    <nav>
      <div className="nav-wrapper blue darken-1">
        <Link to={"/"} className="brand-logo">
          Главная
        </Link>

        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <a href="http://localhost:4001/google">Гугл</a>
          </li>
          <li>
            <div className="switch">
              <label>
                <span className="white-text">Светлая</span>
                <input checked={theme} onChange={changeTheme} type="checkbox" />
                <span className="lever"></span>
                <span className="white-text">Темная</span>
              </label>
            </div>
          </li>

          {auth.name && (
            <li>
              <Link to={`/user/${auth.userId}`}>Привет, {auth.name}</Link>
            </li>
          )}
          <li>
            <Link
              to="/auth"
              onClick={auth.isAuthenticated ? logoutHandler : null}
            >
              {auth.isAuthenticated ? "Выйти" : "Войти"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
