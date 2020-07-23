const jwt = require("jsonwebtoken");
const config = require("../client/src/config/default");
const { check } = require("express-validator");

module.exports = (req, res, next) => {
  console.log("middlewarelogin", req.user);
  // if (!req.user) {
  //   return res.status(401).send({ error: 'You must log in!' });
  // }

  if (!req.isAuthenticated()) {
    return res.status(401).send({ error: "You must log in!" });
  }

  next();
};
