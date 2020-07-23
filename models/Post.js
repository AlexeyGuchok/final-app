const Sequelize = require("sequelize");
const db = require("../database/database");

const Posts = db.define("post", {
  id: {
    type: Sequelize.NUMBER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: Sequelize.TEXT("tiny"),
  },
  title: {
    type: Sequelize.TEXT("tiny"),
  },
  updated: {
    type: Sequelize.DATE,
  },
  date: {
    type: Sequelize.DATE,
  },
  rating: {
    type: Sequelize.DECIMAL,
  },
  preview: {
    type: Sequelize.TEXT("tiny"),
  },
  genre: {
    type: Sequelize.TEXT("tiny"),
  },
  grades: {
    type: Sequelize.TEXT,
  },
  image: {
    type: Sequelize.TEXT("tiny"),
  },
});

module.exports = Posts;
