const Sequelize = require("sequelize");
const db = require("../database/database");

const Comments = db.define(
  "comments",
  {
    id: {
      type: Sequelize.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: Sequelize.NUMBER,
    },
    user_id: {
      type: Sequelize.NUMBER,
    },
    name: {
      type: Sequelize.TEXT("tiny"),
    },
    surname: {
      type: Sequelize.TEXT("tiny"),
    },
    text: {
      type: Sequelize.TEXT,
    },
    date: {
      type: Sequelize.TIME,
    },
  },
  {
    tableName: "comments",
  }
);

module.exports = Comments;
