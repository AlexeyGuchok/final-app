const Sequelize = require("sequelize");
const db = require("../database/database");

const Chapter = db.define(
  "chapter",
  {
    id: {
      type: Sequelize.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: Sequelize.NUMBER,
    },
    chapter_number: {
      type: Sequelize.NUMBER,
    },
    content: {
      type: Sequelize.TEXT,
    },
    image: {
      type: Sequelize.TEXT("tiny"),
    },
    likes: {
      type: Sequelize.NUMBER,
    },
    users_likes: {
      type: Sequelize.TEXT,
    },
  },
  {
    tableName: "chapter",
    indexes: [{ type: "FULLTEXT", name: "post_id", fields: ["content"] }],
  }
);

module.exports = Chapter;
