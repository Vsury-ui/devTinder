const express = require("express");

const app = express();

app.get("/getUserData", (req, res) => {
  //   try {
  //     throw new Error("Something went wrong!");
  //   } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
  // }
  //res.send("User data");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.status(500).send("Internal Server Error from error handler");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
