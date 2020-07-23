import React, { useState, useEffect, useContext } from "react";
import config from "../../config/default";
import { useHistory } from "react-router-dom";
import { useMessage } from "../../hooks/message.hook";
import { AuthContext } from "../../context/AuthContext";
import deleteIcon from "../../images/criss-cross.png";

export const CreatePage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const message = useMessage();
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    async function fetchAPI() {
      try {
        const response = await fetch(config.baseUrl + "/api/link", {
          method: "GET",
          headers: {
            authorization: userData
              ? userData.token
              : auth.token
              ? auth.token
              : "",
          },
        });

        const users = await response.json();
        setData(users.users);
      } catch (e) {
        setError(e.message);
        console.log(e);
      }
    }
    fetchAPI();
  }, []);

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

  const onBlockHandler = async (idsArray, status) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const myId = userData ? userData.userId : null;

    try {
      let response = await fetch(config.baseUrl + "/api/link/block", {
        method: "PUT",
        body: JSON.stringify({ id: idsArray, status }),
        headers: {
          "Content-Type": "application/json",
          authorization: userData ? userData.token : "",
        },
      });
      response = await response.json();
      message(response.message);
      const newData = data.map((element) => {
        if (response.ids.includes(element.id)) {
          return { ...element, status: response.status };
        }
        return element;
      });

      setData(newData);
      console.log(status, "status status");
      if (idsArray.includes(myId) && !!status === true) {
        auth.logout();
        history.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const checkboxBlockUsers = (status) => {
    const users = data
      .filter((element) => element.checked)
      .map((element) => element.id);
    onBlockHandler(users, status);
  };

  const deleteAllHandler = () => {
    const users = data
      .filter((element) => element.checked)
      .map((element) => element.id);
    deleteHandler(users);
  };

  return (
    <div className="row">
      <div className="nav-content margin">
        <ul className="tabs tabs-transparent">
          <li className="tab blue darken-4">
            <a
              className="active"
              onClick={() => checkboxBlockUsers(1)}
              href="#"
            >
              Блокировать
            </a>
          </li>
          <li className="tab green lighten-2">
            <a
              className="active"
              onClick={() => checkboxBlockUsers(0)}
              href="#"
            >
              Разлокировать
            </a>
          </li>
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
            <th>ID</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Почта</th>
            <th>Дата регистрации</th>
            <th>Последний сеанс</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.map((element, index) => {
              const d = new Date(element.last);
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
                  <td>{element.id}</td>
                  <td>{element.name}</td>
                  <td>{element.surname}</td>
                  <td>{element.email}</td>
                  <td>{element.registration}</td>
                  <td>{datestring}</td>
                  <td>{element.status ? "Блокирован" : "Разблокирован"}</td>
                  <td>
                    <div className="row">
                      <a
                        href="#"
                        className="action-button"
                        onClick={() => deleteHandler([element.id])}
                      >
                        <img src={deleteIcon} alt="Удалить" title="Удалить" />
                      </a>
                      <a
                        href="#"
                        className="action-button"
                        onClick={() =>
                          onBlockHandler([element.id], !element.status)
                        }
                      >
                        {element.status ? "Разблокировать" : "Заблокировать"}
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
