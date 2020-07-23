import React, { useState, useEffect, useContext } from "react";
import config from "../../config/default";
import { useHistory, Link } from "react-router-dom";
import { useMessage } from "../../hooks/message.hook";
import { AuthContext } from "../../context/AuthContext";
import styles from "./style.module.scss";

export const Posts = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    async function fetchAPI() {
      try {
        const response = await fetch(config.baseUrl + "/api/posts", {
          method: "GET",
          headers: {
            authorization: userData
              ? userData.token
              : auth.token
              ? auth.token
              : "",
          },
        });

        const data = await response.json();
        setData(data.posts);
        console.log(data);
      } catch (e) {
        setError(e.message);
        console.log(e);
      }
    }
    fetchAPI();
  }, [setError, setData]);

  const deleteHandler = async (userId) => {
    const deletedUsersList = { id: userId };
    const userData = JSON.parse(localStorage.getItem("userData"));

    try {
      let response = await fetch(config.baseUrl + "/api/link/delete", {
        method: "DELETE",
        body: JSON.stringify(deletedUsersList),
        headers: {
          "Content-Type": "application/json",
          authorization: userData ? userData.token : "",
        },
      });
      response = await response.json();
      message(response.message);
      const newData = data.filter(
        (element) => !response.id.includes(element.id)
      );

      setData(newData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section>
      <div className="row">
        <div className="col s3">
          <h3>Меню</h3>
          <div>
            <div>посты</div>
            <div>пользователи</div>
            <div>категории</div>
          </div>
        </div>

        <div className="col s9">
          <h3>Статьи</h3>
          <div className={styles.articles_wrap}>
            {data &&
              data.length &&
              data.map(
                ({
                  title,
                  author,
                  id,
                  preview,
                  date,
                  genre,
                  rating,
                  grades,
                  image,
                }) => (
                  <article
                    key={id}
                    className="card card-panel lighten-2 hoverable"
                  >
                    <div className="card-image waves-effect waves-block waves-light">
                      <img className="activator" src={image} />
                    </div>

                    <div className="card-content">
                      <span className="card-title activator">
                        <Link className="light-blue-text" to={`/posts/${id}`}>
                          {title}
                        </Link>
                        <i className="material-icons right">more_vert</i>
                      </span>
                    </div>

                    <div>Автор: {author}</div>
                    <div>Жанр: {genre}</div>
                    <div>
                      Теги:
                      <div className="chip">История</div>
                    </div>
                    <div>
                      Рейтинг: {rating}{" "}
                      <Link to={"/posts/" + id + "#rating"}>Отзывы</Link>
                    </div>
                    <div>Ср рейт: {grades}</div>

                    <div className="card-reveal">
                      <span className="card-title grey-text text-darken-4">
                        Краткое описание главы
                        <i className="material-icons right">close</i>
                      </span>
                      <p>{preview}</p>
                    </div>

                    <div>Дата: {date}</div>
                    <div>
                      <Link
                        className="btn waves-effect waves-teal"
                        to={`/posts/${id}`}
                      >
                        Читать
                      </Link>
                    </div>
                  </article>
                )
              )}
          </div>
        </div>
      </div>
    </section>
  );
};
