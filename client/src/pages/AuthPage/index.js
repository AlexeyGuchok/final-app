import React, { useState, useEffect, useCallback, useContext } from "react";
import config from "../../config/default";
import { useMessage } from "../../hooks/message.hook";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

export const AuthPage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const clearError = useCallback(() => setError(null), []);
  const [changeAuth, setChangeAuth] = useState(true);

  useEffect(() => {
    message(error);
    clearError();
  }, [error, clearError, message]);

  useEffect(() => {
    window.M.updateTextFields();
  }, [changeAuth]);

  const changleHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerHandler = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:" + config.port + "/api/auth/registration",
        {
          method: "POST",
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(false);
      const data = await response.json();
      message(data.message);
    } catch (e) {
      setLoading(false);
      setError(e.message);
      console.log(e);
    }
  };

  const loginHandler = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:" + config.port + "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(false);
      const data = await response.json();
      console.log(data, "+++++++++++++++");
      auth.login(data.token, data.userId, data.role, data.name, data.surname);
      history.push("/");
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  };

  const authorizationHandler = (value) => {
    setChangeAuth(value);
  };

  return (
    <div className="row">
      <div className="row choose-menu center-align ">
        <div
          className="col s6 card blue darken-4 hoverable"
          onClick={() => authorizationHandler(true)}
        >
          <a href="#" className="white-text">
            <span className="flow-text">Авторизация</span>
          </a>
        </div>
        <div
          className="col s6 card yellow darken-4 hoverable"
          onClick={() => authorizationHandler(false)}
        >
          <span className="flow-text">
            <a href="#" className="white-text">
              Регистрация
            </a>
          </span>
        </div>
      </div>

      {changeAuth && (
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Авторизaция</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  value={form.email}
                  className="yellow-btn"
                  onChange={changleHandler}
                />
                <label htmlFor="email">Почта</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  className="yellow-btn"
                  onChange={changleHandler}
                />
                <label htmlFor="password">Пароль</label>
              </div>

              <div className="card-action">
                <a
                  disabled={loading}
                  onClick={loginHandler}
                  className="btn yellow darken-4 waves-effect"
                >
                  Войти
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {!changeAuth && (
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Регистрация</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Ваше имя"
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  className="yellow-btn"
                  onChange={changleHandler}
                />
                <label htmlFor="name">Имя</label>
              </div>
              <div className="input-field">
                <input
                  placeholder="Ваша фамилия"
                  id="surname"
                  type="text"
                  name="surname"
                  value={form.surname}
                  className="yellow-btn"
                  onChange={changleHandler}
                />
                <label htmlFor="surname">Фамилия</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  value={form.email}
                  className="yellow-btn"
                  onChange={changleHandler}
                />
                <label htmlFor="email">Почта</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  className="yellow-btn"
                  onChange={changleHandler}
                />
                <label htmlFor="password">Пароль</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              onClick={registerHandler}
              disabled={loading}
              className="btn grey lighten-2 black-text waves-effect"
            >
              Регистрация
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
