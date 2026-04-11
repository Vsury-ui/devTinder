const express = require("express");

const app = express();

// app.use(
//   "/user",
//   (req, res) => {
//     console.log("User route accessed");
//     res.send("User routed");
//   });

app.use("/user", [
  (req, res, next) => {
    console.log("User route accessed");
    next();
    //res.send("User routed");
  },
  (req, res, next) => {
    console.log("Second middleware for /user");
    //res.send("Second middleware response");
    next();
  },
  (req, res, next) => {
    console.log("Third middleware for /user");
    //res.send("Third middleware response");
    next();
  },
  (req, res, next) => {
    console.log("Fourth middleware for /user");
    // res.send("Fourth middleware response");
    next();
  },
  (req, res, next) => {
    console.log("Final handler for /user");
    res.send("User routed");
  },
]);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
