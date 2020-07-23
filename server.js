const express = require("express");
const config = require("./client/src/config/default");
const db = require("./database/database");
const cors = require("cors");
const app = express();
const path = require("path");
const isAuth = require("./middleware/auth.middleware");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./services/passportGS");

const isAuthWithConn = (req, res, next) => {
  return isAuth(req, res, next, db);
};

app.use(cors());
app.use(express.json({ extended: true }));

const PORT = config.port || 5000;

const authRoutes = require("./routes/auth.routes");
const linkRoutes = require("./routes/link.routes");
const postsRoutes = require("./routes/posts.routes");

app.use("/api/auth", authRoutes);
app.use("/api/link", isAuthWithConn, linkRoutes);
app.use("/api/posts", postsRoutes);

app.use(
  cookieSession({
    name: "tuto-session",
    keys: ["key1", "key2"],
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(passport.initialize());
app.use(passport.session());

app.get("/failed", (req, res) => res.send("You Failed to login"));
app.get("/good", isLoggedIn, (req, res) =>
  res.send(`Welcome mr ${req.user.displayName}`)
);

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/good");
  }
);

app.get("/logout", (res, req) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

async function start() {
  try {
    db.authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });

    app.listen(PORT, () => console.log(`PORT: ${PORT}`));
  } catch (e) {
    console.log("Error, ", e.message);
  }
}

start();
