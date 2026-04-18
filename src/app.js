const express = require("express");
const { connectDB } = require("./config/database");

const User = require("./models/user");
const user = require("./models/user");

const app = express();
//express middleware to parse JSON request bodies
app.use(express.json());

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
    console.error("Error fetching user", err);
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
    console.error("Error fetching user", err);
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  // create a new user document and save it to the database

  console.log(req.body);

  const user = new User(req.body);
  try {
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
    res.status(400).send("Something went wrong: " + err.message);
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
