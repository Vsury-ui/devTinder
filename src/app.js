const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello , hello , Hello from hello route");
});

app.use("/test", (req, res) => {
  res.send("Hello from server!");
});

app.use("/", (req, res) => {
  res.send("Hello from route");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
