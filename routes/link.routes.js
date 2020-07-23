const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const Post = require("../models/Post");
const Chapter = require("../models/Chapter");

router.get("/", async (req, res) => {
  try {
    const result = await User.findAll({});
    return res.json({ users: result });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова" });
  }
});

router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  const idsString = id.reduce((acc, element, i) => {
    if (i < id.length - 1) return acc + element + ",";
    return acc + element;
  }, "");
  try {
    await User.destroy({
      where: {
        id: idsString,
      },
    });
    res.status(201).json({ message: "Пользователь Удален", id: id });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова" });
  }
});

router.put("/block", async (req, res) => {
  const { id, status } = req.body;
  const idsString = id.reduce((acc, element, i) => {
    if (i < id.length - 1) return acc + element + ",";
    return acc + element;
  }, "");

  try {
    const result = await User.update(
      {
        status: status ? 1 : 0,
      },
      {
        where: {
          id: [idsString],
        },
      }
    );
    if (result) {
      return res.status(201).json({
        message: `Пользовате(ль/ли) ${
          status ? "Блокирован(/ны)" : "Разблокирован(/ны)"
        }`,
        ids: id,
        status: status,
      });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const [userPosts, userData] = await Promise.all([
      Post.findAll({
        where: {
          author: req.params.id,
        },
      }),
      User.findOne({
        where: {
          id: req.params.id,
        },
      }),
    ]);

    res.json({
      userData: userData,
      userPosts: userPosts.length ? userPosts : null,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "went wrong try again" });
  }
});

router.get("/user/edit-post", async (req, res) => {
  try {
    const [userPosts, userChapters] = await Promise.all([
      Post.findAll({
        where: {
          author: req.params.id,
        },
      }),
      Chapter.findAll({
        where: {
          id: req.params.id,
        },
      }),
    ]);

    console.log(userPosts[0], userChapters[0]);

    res.json({
      userChapters: userChapters,
      userPosts: userPosts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "went wrong try again" });
  }
});

module.exports = router;
