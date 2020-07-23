import { useState, useCallback, useEffect } from "react";

const userTheme = "userTheme";

export const useTheme = () => {
  const [theme, setTheme] = useState(false);

  const changeTheme = useCallback(() => {
    localStorage.setItem(userTheme, JSON.stringify({ theme: !theme }));
    setTheme(!theme);
  }, [theme, setTheme]);

  useEffect(() => {
    const userThemeMode = JSON.parse(localStorage.getItem(userTheme));
    const data = userThemeMode ? userThemeMode.theme : false;
    setTheme(data);
  }, [setTheme]);

  return { theme, changeTheme };
};
