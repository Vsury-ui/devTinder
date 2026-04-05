const express = require("express");

const app = express();

app.get("/user/:userId", (req, res) => {
  console.log(req.params.userId);
  res.send({ firstName: "Vivek", lastName: "Suryawanshi" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
