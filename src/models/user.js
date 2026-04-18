const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(this.email)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (["male", "female", "other"].indexOf(value) === -1) {
          throw new Error("Gender must be either male, female or other");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      validate(value) {
        if (!validator.isURL(this.photoUrl)) {
          throw new Error("Invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      default:
        "This is default about section. Please update it to tell others about yourself.",
    },
    skills: {
      type: [String],
      array: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
