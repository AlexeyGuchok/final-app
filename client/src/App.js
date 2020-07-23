import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import config from "./config/default";
import { useRoutes } from "./routes";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { useTheme } from "./hooks/theme.hook";
import "materialize-css";

function App() {
  const { login, logout, token, userId, role, name, surname } = useAuth();
  const { theme, changeTheme } = useTheme();
  const [error, setError] = useState(null);
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated, role);
  const [search, setSearch] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const searchHandler = async (e) => {
    const params = { pattern: e.target.value };
    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    try {
      const response = await fetch(
        config.baseUrl + "/api/posts/search?" + query,
        {
          method: "GET",
          headers: {
            authorization: userData ? userData.token : token ? token : "",
          },
        }
      );

      const data = await response.json();
      setSearch(data);
    } catch (e) {
      setError(e.message);
      console.log(e);
    }
  };

  return (
    <div className={theme ? "black white-text" : ""}>
      <AuthContext.Provider
        value={{ login, logout, token, userId, isAuthenticated, name, surname }}
      >
        <Navbar changeTheme={changeTheme} theme={theme}></Navbar>
        <div className="row">
          <div className="col s10 offset-s1">
            <input type="text" placeholder="Поиск" onChange={searchHandler} />
            {search && search.posts.length
              ? search.posts.map((element) => {
                  return (
                    <div>
                      <div class="section">
                        <h5>
                          <Link to={`/posts/${element.id}`}>
                            {element.title}
                          </Link>
                        </h5>
                        <p>Stuff</p>
                      </div>
                      <div class="divider"></div>
                    </div>
                  );
                })
              : "Ничего не нашлось"}
          </div>
        </div>
        <div className="container">{routes}</div>
        <Footer />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
