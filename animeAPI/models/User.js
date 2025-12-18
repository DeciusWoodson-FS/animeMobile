const mongoose = require("mongoose");
const bcrpyt = require("bcrypt-nodejs");

const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: "Email address is required",
    validate: [validateEmail, "Email invalid"],
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isNew || user.isModified("password")) {
    // run hashing and salting
    bcrpyt.genSalt(10, (error, salt) => {
      if (error) {
        return next(error);
      }
      bcrpyt.hash(user.password, salt, null, (error, hash) => {
        if (error) {
          return next(error);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    // skip hashing and salting
    next();
  }
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrpyt.compare(candidatePassword, this.password, function (error, isMatch) {
    if (error) {
      return callback(error);
    }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
