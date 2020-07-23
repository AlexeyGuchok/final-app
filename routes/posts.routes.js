const { Router, response } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Post = require("../models/Post");
const Chapter = require("../models/Chapter");
const User = require("../models/User");
const Comments = require("../models/Comments");
const Sequelize = require("sequelize");

router.get("/search", async (req, res) => {
  const query = req.query;
  try {
    const searchChaptersResult = await Chapter.findAll({
      where: Sequelize.literal(
        "MATCH (content) AGAINST (:name IN BOOLEAN MODE)"
      ),
      replacements: {
        name: query.pattern,
      },
    });
    if (searchChaptersResult) {
      const id = searchChaptersResult.map((element) => element.post_id);
      const postsList = await Post.findAll({
        where: {
          id: id,
        },
      });
      return res.json({
        posts: postsList,
      });
    }
    // const searchCommentsResult = await Comments.findAll({
    //   where: Sequelize.literal("MATCH (SomeField) AGAINST (:name)"),
    //   replacements: {
    //     name: "Alex",
    //   },
    // });
    return res.json({
      message: "Ничего не нашлось",
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [headArticle, contentArticle, comments] = await Promise.all([
      Post.findOne({ where: { id: req.params.id } }),
      Chapter.findAll({ where: { post_id: req.params.id } }),
      Comments.findAll({ where: { post_id: req.params.id } }),
    ]);

    // let headArticle = await Post.findOne({ id: req.params.id });
    // let contentArticle = await Chapter.findAll({ post_id: req.params.id });

    if (!headArticle || !contentArticle) {
      res.status(404).json({ error: "Статья не найдена" });
    }

    // headArticle.date = headArticle.date
    //   ? headArticle.date.toDateString()
    //   : "no-date";

    res.json({
      headArticle,
      contentArticle,
      comments,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "went wrong try again" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await Post.findAll({});
    const likes = await Chapter.findAll({});

    return res.json({ posts: result });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова" });
  }
});

router.post("/add", async (req, res) => {
  console.log(req.body);
  try {
    const { title, preview, user_id, text, genre } = req.body;
    const responsePost = await Post.create({
      title,
      genre,
      author: user_id,
      preview: preview ? preview : text.slice(0, 140),
      date: new Date(),
      updated: new Date(),
      // image: image
      //   ? image
      //   : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Keen_Bild_Taxon.svg/1200px-Keen_Bild_Taxon.svg.png",
    });

    const responseChapter = await Chapter.create({
      title,
      chapter_number: 1,
      post_id: responsePost.id,
      author: user_id,
      content: text,
      date: new Date(),
      updated: new Date(),
      // image: image
      //   ? image
      //   : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Keen_Bild_Taxon.svg/1200px-Keen_Bild_Taxon.svg.png",
    });

    console.log(responseChapter);

    if (responsePost && responseChapter) {
      return res.status(201).json({
        data: [responsePost, responseChapter],
        message: "Пост успешно создан",
      });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова", e });
  }
});

router.put("/like", async (req, res) => {
  try {
    let article = await Chapter.findOne({
      where: { post_id: req.body.id, chapter_number: req.body.chapter_number },
    });

    if (!article) {
      res.status(404).json({ error: "Статья не найдена" });
    }

    const usersLikes = article.users_likes.split(",");

    const isUserLiked = usersLikes.includes(req.body.userId.toString());

    if (isUserLiked) {
      const updates = {
        likes: article.likes - 1,
        users_likes: usersLikes
          .filter((element) => element !== req.body.userId.toString())
          .join(","),
      };
      const result = await Chapter.update(updates, {
        where: {
          id: req.body.id,
          chapter_number: req.body.chapter_number,
        },
      });
      return res.json({ message: "Вы убрали лайк", article: updates });
    }
    const updates = {
      likes: article.likes ? article.likes + 1 : 1,
      users_likes: [...usersLikes, req.body.userId].join(","),
    };
    const result = await Chapter.update(updates, {
      where: {
        post_id: req.body.id,
        chapter_number: req.body.chapter_number,
      },
    });
    return res.json({ message: "Вы поставили лайк", article: updates });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "went wrong try again" });
  }
});

router.post("/comment", async (req, res) => {
  try {
    const { name, surname, post_id, user_id, text } = req.body;

    const response = await Comments.create({
      post_id,
      user_id,
      name,
      surname,
      text,
      date: new Date(),
    });

    const newComments = await Comments.findAll({ id: post_id });

    if (response) {
      return res
        .status(201)
        .json({ data: newComments, message: "Комментарий создан" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Что-то пошло не так. попробуйте снова", e });
  }
});

module.exports = router;
