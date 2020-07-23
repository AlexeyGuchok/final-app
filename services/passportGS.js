const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findOne({ where: { googleId: id } });
  console.log(user);
  if (user) {
    return done(null, user);
  }

  return done(new Error());
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "273658734861-v2034eqjghe46uonuc6k5j7lkteldret.apps.googleusercontent.com",
      clientSecret: "Gau7p5l6k0xl2YIW6Xn91ytj",
      callbackURL: "http://localhost:9998/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await User.findOne({ where: { googleId: profile.id } });
      console.log(user);
      if (user) {
        return done(null, user);
      }
      const newUser = await User.create({ googleId: profile.id });
      return done(null, newUser);
    }
  )
);
