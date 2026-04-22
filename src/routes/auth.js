const User = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");

const { validateSignupData } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // create a new user document and save it to the database

  try {
    // Validate the incoming data
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user document
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    if (user.skills.length > 10) {
      throw new Error("You can add maximum 10 skills");
    }
    if (user.photoUrl && !user.photoUrl.startsWith("http")) {
      throw new Error("Photo URL must be a valid URL");
    }
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error creating user", err);
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("Invalid credentials ");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create a JWT token and send it back to the client
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }); // Set cookie to expire in 7 days
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error logging in", err);
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send();
});

module.exports = authRouter;
