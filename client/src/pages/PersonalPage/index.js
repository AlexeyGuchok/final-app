import React, { useState, useEffect, useContext } from "react";
import config from "../../config/default";
import { useHistory, Link } from "react-router-dom";
import { useMessage } from "../../hooks/message.hook";
import { AuthContext } from "../../context/AuthContext";
import deleteIcon from "../../images/criss-cross.png";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import ReactMarkdown from "react-markdown/with-html";
import "react-mde/lib/styles/css/react-mde-all.css";
import styles from "./style.module.scss";

const input = "# This is a header\n\nAnd this is a paragraph";
const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});

export const PersonalPage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [error, setError] = useState(null);
  const [checkAll, setCheckAll] = useState(false);
  const [data, setData] = useState(null);
  const [value, setValue] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("write");
  const [articleTitle, setArticleTitle] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    async function fetchAPI() {
      try {
        const id = auth.userId;
        const response = await fetch(config.baseUrl + "/api/link/user/" + id, {
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
      message(response.message);
      const newData = data.filter(
        (element) => !response.id.includes(element.id)
      );

      setData(newData);
    } catch (e) {
      console.log(e);
    }
  };

  const checkHandler = (index) => {
    const newData = data.map((element, elementIndex) => {
      if (elementIndex === index) {
        return { ...element, checked: !element.checked };
      }
      return element;
    });
    setData(newData);
  };

  const checkAllUsers = () => {
    setCheckAll(!checkAll);
    const newData = data.map((element, elementIndex) => {
      return { ...element, checked: !checkAll };
    });
    setData(newData);
  };

  const deleteAllHandler = () => {
    const users = data
      .filter((element) => element.checked)
      .map((element) => element.id);
    deleteHandler(users);
  };

  const articleTitleHandler = (e) => {
    setArticleTitle(e.target.value);
  };

  const sendPost = async () => {
    console.log(auth.userId, value, articleTitle);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const newPost = {
      user_id: auth.userId,
      title: articleTitle,
      text: converter.makeHtml(value),
    };
    try {
      const response = await fetch(
        "http://localhost:" + config.port + "/api/posts/add",
        {
          method: "POST",
          body: JSON.stringify(newPost),
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
      setValue("");
      const data = await response.json();
      console.log(data);
      // setData({ ...data, comments: newComments.data });
      message(data.message);
    } catch (e) {
      // setLoading(false);
      // setError(e.message);
      console.log(e);
    }
  };

  return (
    <div className="row">
      <div>
        <h1>Профиль</h1>
        {data && data.userData && (
          <div>
            <h3>{data.userData.name + " " + data.userData.surname}</h3>
            <div>Дата регистрации: {data.userData.registration}</div>
            <div>Почта: {data.userData.email}</div>
          </div>
        )}
        <h5>Добавить пост</h5>
        <a class="btn-floating btn-large waves-effect waves-light red">
          <i class="material-icons">add</i>
        </a>
        <input
          type="text"
          placeholder="Название Статьи"
          value={articleTitle}
          onChange={articleTitleHandler}
        />
        <ReactMde
          value={value}
          onChange={setValue}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(converter.makeHtml(markdown))
          }
        />
        <ReactMarkdown source={value} escapeHtml={false} />
        <a class="waves-effect waves-light btn" onClick={sendPost}>
          <i class="material-icons left">cloud</i>Сохранить
        </a>
      </div>

      {data && data.userPosts && (
        <>
          <h2>Ваши посты:</h2>
          <div className="nav-content margin">
            <ul className="tabs tabs-transparent">
              <li className="tab red lighten-2">
                <a className="active" onClick={deleteAllHandler} href="#">
                  Удалить
                </a>
              </li>
            </ul>
          </div>
          <table className="highlight centered responsive-table">
            <thead>
              <tr>
                <th>
                  <label>
                    <input
                      onChange={checkAllUsers}
                      checked={checkAll}
                      type="checkbox"
                    />
                    <span></span>
                  </label>
                </th>
                <th>Название статьи</th>
                <th>Создана</th>
                <th>Изменена</th>
                <th>Жанр</th>
                <th>Рейтинг</th>
                <th>Действие</th>
              </tr>
            </thead>

            <tbody>
              {data.userPosts.map((element, index) => {
                const d = new Date(element.date);
                let datestring =
                  ("0" + d.getDate()).slice(-2) +
                  "-" +
                  ("0" + (d.getMonth() + 1)).slice(-2) +
                  "-" +
                  d.getFullYear() +
                  " ";
                return (
                  <tr key={element.id}>
                    <td>
                      <label>
                        <input
                          onChange={() => checkHandler(index)}
                          type="checkbox"
                          checked={element.checked ? true : false}
                        />
                        <span></span>
                      </label>
                    </td>
                    <td>
                      <Link to={`/posts/${element.id}`}>{element.title}</Link>
                    </td>
                    <td>{datestring}</td>
                    <td>{element.updated}</td>
                    <td>{element.genre}</td>
                    <td>{element.rating}</td>

                    <td>
                      <div className="row">
                        <a
                          href="#"
                          className="action-button"
                          onClick={() => deleteHandler([element.id])}
                        >
                          <img src={deleteIcon} alt="Удалить" title="Удалить" />
                        </a>
                        <a href="#" className="action-button">
                          Редактировать
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
