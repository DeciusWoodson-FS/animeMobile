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

exports.signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user), user_id: req.user._id });
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide your email and password" });
  }

  try {
    // Check for existing user using await
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(422).json({ error: "Email is in use" });
    }

    const user = new User({
      email: email,
      password: password,
    });

    // Save user using await
    await user.save();

    res.json({ user_id: user._id, token: tokenForUser(user) });
  } catch (error) {
    return next(error);
  }
};
