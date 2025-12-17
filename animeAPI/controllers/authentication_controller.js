const User = require("../models/User");
const jwt = require("jwt-simple");
const config = require("../config");

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode(
    {
      sub: user._id,
      iat: timestamp,
    },
    config.secret
  );
};

exports.signup = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide your email and password" });
  }

  User.findOne({ email: email }, (error, existingUser) => {
    if (error) {
      return next(error);
    }
    if (existingUser) {
      return res.status(422).json({ error: "Email aleady in use" });
    }

    const user = new User({
      email: email,
      password: password,
    });
    user.save((error) => {
      if (error) {
        return next(error);
      }
      res.json({ user_id: user._id, token: tokenForUser(user) });
    });
  });
};
