const express = require("express");
const { connectDB } = require("./config/database");

const User = require("./models/user");

const app = express();
//express middleware to parse JSON request bodies
app.use(express.json());

app.post("/signup", async (req, res) => {
  // create a new user document and save it to the database

  console.log(req.body);

  const user = new User(req.body);
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error creating user", err);
    res.status(400).send("Internal Server Error");
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
