import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [surname, setSurname] = useState(null);

  const login = useCallback((jwtToken, id, role, name, surname) => {
    setToken(jwtToken);
    setUserId(id);
    setRole(role);
    setName(name);
    setSurname(surname);

    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
        role: role,
        name: name,
        surname: surname,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setRole(null);
    setName(null);
    setSurname(null);

    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      login(data.token, data.userId, data.role, data.name, data.surname);
    }
  }, [login]);

  return { login, logout, role, token, userId, name, surname };
};
