import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import config from "../config/default";

export const Footer = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const logoutHandler = (event) => {
    event.preventDefault();
    auth.logout();
    history.push("/");
  };

  return (
    <footer className="page-footer">
      <div className="container">
        <div className="row">
          <div className="col l6 s12">
            <div className="white-text">Фанфики</div>
            <p className="grey-text text-lighten-4">
              Читайте топовые фанфики в нашем приложении.
            </p>
          </div>
          <div className="col l4 offset-l2 s12">
            <div className="white-text">Links</div>
            <ul>
              <li>
                <Link className="grey-text text-lighten-3" to="/">
                  Статьи
                </Link>
              </li>
              <li>
                <Link className="grey-text text-lighten-3" to="/create">
                  Пользователи
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
          © 2020 Copyright Text
          <a
            className="grey-text text-lighten-4 right"
            href="https://vk.com/id28938522"
          >
            Создание приложений
          </a>
        </div>
      </div>
    </footer>
  );
};
