const { Router } = require("express");
const router = Router();
const bcypt = require("bcryptjs");
const { check, validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("../client/src/config/default");
const User = require("../models/User");

router.post(
  "/registration",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длина пароля 1 символ").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Некорректные данные" });
      }
      const { name, surname, password, email, role } = req.body;

      console.log(email);
      const [candidate] = await User.findAll({
        where: {
          email: email,
        },
      });

      if (candidate) {
        return res.status(400).json({
          message: "Пользователь с такой почтой уже зарегистрирован.",
        });
      }
      const hashedPassword = await bcypt.hash(password, 12);

      const response = await User.create({
        name,
        surname,
        email,
        password: hashedPassword,
        registration: new Date(),
        last: new Date(),
        role: role,
      });
      if (response) {
        return res.status(201).json({ message: "Пользователь создан" });
      }
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Что-то пошло не так. попробуйте снова", e });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при входе в систему",
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      const isMatch = await bcypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Неверный пароль" });
      }

      const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
        expiresIn: "12h",
      });

      await User.update(
        { last: new Date() },
        {
          where: {
            email: email,
          },
        }
      );

      return res.json({
        token,
        userId: user.id,
        name: user.name,
        surname: user.surname,
      });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ message: "Something went wrong, try again" });
    }
  }
);

module.exports = router;
