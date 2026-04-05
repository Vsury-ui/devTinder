const express = require("express");

const app = express();

app.use("/user", (req, res) => {
  res.send({ message: "HAHAHA" });
});

app.get("/user", (req, res) => {
  res.send({ firstName: "Vivek", lastName: "Suryawanshi" });
});

app.post("/user", (req, res) => {
  console.log(" data saved to database successfully");
  res.send({ message: "User data saved successfully" });
});

app.delete("/user", (req, res) => {
  console.log("User data deleted from database successfully");
  res.send({ message: "User data deleted successfully" });
});

app.use("/test", (req, res) => {
  res.send("Hello from server!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
