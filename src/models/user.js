const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
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
