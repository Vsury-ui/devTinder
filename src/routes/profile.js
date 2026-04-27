const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {
  validateSignupData,
  validateProfileEditData,
  validatePassword,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, Your profile updated successfully!!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    validatePassword(req);
    const loggedInUser = req.user;
    const { password } = req.body;
    const newPassword = await bcrypt.hash(password, 10);
    loggedInUser.password = newPassword;
    await loggedInUser.save();
    res.send("Password updated successfully!!");
  } catch (err) {
    res.send("PASSWORD UPDATE FAILED: " + err.message);
  }
});

module.exports = profileRouter;
