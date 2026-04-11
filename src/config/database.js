const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:ErQ0I801cLpmgYxV@cluster0.aqo9lpm.mongodb.net/devTinder",
  );
};

module.exports = { connectDB };
