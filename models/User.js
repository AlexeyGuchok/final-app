const Sequelize = require("sequelize");
const db = require("../database/database");

const User = db.define("user", {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  surname: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  registration: {
    type: Sequelize.TIME,
  },
  last: {
    type: Sequelize.TIME,
  },
  role: {
    type: Sequelize.TEXT("tiny"),
    defaultValue: "user",
  },
  googleId: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.NUMBER,
  },
});

module.exports = User;
