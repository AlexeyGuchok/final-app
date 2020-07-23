const jwt = require("jsonwebtoken");
const config = require("../client/src/config/default");
const { check } = require("express-validator");

module.exports = async (req, res, next, db) => {
  if (req.method === "OPTIONS") {
    return next;
  }

  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Нет Токена" });
    }

    const decoded = await jwt.verify(token, config.jwtSecret);
    const id = decoded.userId;

    const [result] = await db.query(
      `SELECT status FROM users WHERE id = "${id}"`
    );

    if (result[0].status == 1) {
      return res.status(401).json({ message: "Доступ заблокирован" });
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Нет авторизации" });
  }
};
