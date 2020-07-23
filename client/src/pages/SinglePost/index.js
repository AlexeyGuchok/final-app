import React, { useState, useEffect, useContext, memo } from "react";
import config from "../../config/default";
import { useHistory, Link } from "react-router-dom";
import { useMessage } from "../../hooks/message.hook";
import { AuthContext } from "../../context/AuthContext";
import userImage from "../../images/user.jpg";
import ReactMarkdown from "react-markdown/with-html";
import styles from "./style.module.scss";

const SinglePost = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    async function fetchAPI() {
      try {
        const id = history.location.pathname.split("/").pop();
        const response = await fetch(config.baseUrl + "/api/posts/" + id, {
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
        setData(data);
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
      // message(response.message);
      const newData = data.filter(
        (element) => !response.id.includes(element.id)
      );

      setData(newData);
    } catch (e) {
      console.log(e);
    }
  };
  const avg = (grades) => {
    const array = JSON.parse(grades);
    if (array.length == 0) {
      return "Оцените этот пост первым!";
    }

    const summ = array.reduce((acc, element) => {
      return acc + element;
    });
    return Math.round((summ * 10) / array.length) / 10;
  };

  const addLike = async (id, chapterId) => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const response = await fetch(
        "http://localhost:" + config.port + "/api/posts/like",
        {
          method: "PUT",
          body: JSON.stringify({
            id: id,
            userId: userData.userId,
            chapter_number: chapterId,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: userData
              ? userData.token
              : auth.token
              ? auth.token
              : "",
          },
        }
      );

      // setLoading(false);
      const likes = await response.json();
      console.log(likes);
      const newArticles = data.contentArticle.map((element) => {
        return element.id == id ? { ...element, ...likes.article } : element;
      });
      setData({ ...data, contentArticle: newArticles });
      console.log(data);
      message(likes.message);
    } catch (e) {
      // setLoading(false);
      message(e.message);
    }
  };

  const openHandler = (id) => {
    const content = data.contentArticle;
    const newContent = content.map((element) => {
      return element.id === id ? { ...element, open: !element.open } : element;
    });
    setData({ ...data, contentArticle: newContent });
  };

  const sendComment = async () => {
    const text = comment;
    if (!text.trim()) {
      return;
    }
    const userData = JSON.parse(localStorage.getItem("userData"));
    const commentData = {
      name: auth.name,
      surname: auth.surname,
      post_id: data.headArticle.id,
      user_id: auth.userId,
      text: text,
    };
    try {
      const response = await fetch(
        "http://localhost:" + config.port + "/api/posts/comment",
        {
          method: "POST",
          body: JSON.stringify(commentData),
          headers: {
            "Content-Type": "application/json",
            authorization: userData
              ? userData.token
              : auth.token
              ? auth.token
              : "",
          },
        }
      );
      setLoading(false);
      setComment("");
      const newComments = await response.json();
      setData({ ...data, comments: newComments.data });
      message(data.message);
    } catch (e) {
      setLoading(false);
      setError(e.message);
      console.log(e);
    }
  };

  const commentText = (e) => {
    setComment(e.target.value);
  };

  const editHandler = (id) => {};
  const moveUpHandler = (id) => {};
  const moveDownHandler = (id) => {};

  return (
    <section className={styles.single_post}>
      <div className="row">
        <div className="col s3">
          <h5>Меню</h5>
          <div>
            <div>посты</div>
            <div>пользователи</div>
            <div>категории</div>
          </div>
          <div>
            <h5>Навигация</h5>
            <ul>
              {data &&
                data.contentArticle.length !== 0 &&
                data.contentArticle.map((element) => {
                  return (
                    <li>
                      <a href={`#${element.id}`}>Глава: {element.id}</a>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="col s9">
          {data && data.headArticle && (
            <div>
              <h1>{data.headArticle.title}</h1>

              <div className="row s-p__main-image">
                <img
                  src={data.headArticle.image}
                  alt={data.headArticle.title}
                />
              </div>
              <div>
                <Link to="#rating" className="s-p__rating">
                  Рейтинг:
                </Link>
                <span> {avg(data.headArticle.grades)}</span>
              </div>

              <div className="black-text">Автор: {data.headArticle.author}</div>

              <blockquote>
                <ReactMarkdown
                  source={data.headArticle.preview}
                  escapeHtml={false}
                />
              </blockquote>
            </div>
          )}

          <div className="divider"></div>
          <div>
            {data &&
              data.contentArticle.length !== 0 &&
              data.contentArticle.map((element) => (
                <>
                  <div>
                    <button onClick={() => openHandler(element.id)}>...</button>
                    <div
                      className={`${styles.menu} ${
                        element.open ? styles.open : ""
                      }`}
                    >
                      <a
                        className="waves-effect waves-light btn"
                        onClick={() => editHandler(element.id)}
                      >
                        <i className="material-icons left">cloud</i>
                        Редактировать
                      </a>
                      <a
                        className="waves-effect waves-light btn"
                        onClick={() => moveUpHandler(element.id)}
                      >
                        <i className="material-icons left">cloud</i>Выше
                      </a>
                      <a
                        className="waves-effect waves-light btn"
                        onClick={() => moveDownHandler(element.id)}
                      >
                        <i className="material-icons left">cloud</i>Ниже
                      </a>
                    </div>
                  </div>
                  <div className={styles.single_post__chapter}>
                    <h2>Глава {element.chapter_number}</h2>
                    {element.image && <img src={element.image} />}
                    <div id={element.id} className="flow-text">
                      {element.content}
                    </div>
                  </div>
                  <div className="row">
                    {auth.userId && (
                      <i
                        className={`${
                          element.users_likes
                            .split(",")
                            .includes(auth.userId.toString())
                            ? "red"
                            : ""
                        } col s1 small material-icons`}
                        onClick={() =>
                          addLike(data.headArticle.id, element.chapter_number)
                        }
                      >
                        thumb_up
                      </i>
                    )}

                    {!auth.userId && (
                      <i className="col s1 small material-icons">thumb_up</i>
                    )}

                    <span>{element.likes}</span>
                  </div>
                </>
              ))}

            <div className={styles.commentary}>
              <h3>Комментарии:</h3>
              <ul className="collection">
                {data &&
                  data.comments &&
                  data.comments.map((element) => {
                    return (
                      <li className="collection-item avatar black-text">
                        <img src={userImage} alt="User" className="circle" />
                        <span className="title">
                          {element.name + " " + element.surname}
                        </span>
                        <p>{element.date}</p>
                        <p>{element.text}</p>
                        <a href="#!" className="secondary-content">
                          <i className="material-icons">grade</i>
                        </a>
                      </li>
                    );
                  })}
              </ul>
              {auth.userId && (
                <div className={styles.write_comment}>
                  <input
                    type="text"
                    placeholder="Ваш комментарий"
                    onChange={commentText}
                    value={comment}
                  />
                  <button onClick={sendComment}>Отправить</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(SinglePost);
