const express = require("express");
const { connectDB } = require("./config/database");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const User = require("./models/user");

const app = express();
//express middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(updateData).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update contains invalid fields");
    }
    if (updateData.skills.length > 10) {
      throw new Error("You can add maximum 10 skills");
    }
    if (updateData.photoUrl && !updateData.photoUrl.startsWith("http")) {
      throw new Error("Photo URL must be a valid URL");
    }
    await User.findOneAndUpdate({ _id: userId }, updateData, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED:  " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Received connection request:", user);
  res.send(user.firstName + " sent a connection request");
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
