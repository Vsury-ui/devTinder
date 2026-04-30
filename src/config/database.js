const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:3ibSe19O5v1cLTpK@cluster0.aqo9lpm.mongodb.net/devTinder",
  );
};

module.exports = { connectDB };
