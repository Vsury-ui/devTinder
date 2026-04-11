const express = require("express");

const app = express();

const { adminAuth } = require("./middlewares/auth");

//app.use("/admin", adminAuth);

app.get("/admin/getAllData", adminAuth, (req, res) => {
  res.send("This is the admin data");
});

app.get("/admin/deleteData", adminAuth, (req, res) => {
  res.send("Data deleted successfully");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
