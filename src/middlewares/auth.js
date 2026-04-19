const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("No token provided");
    }
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$789");
    const user = await User.findById(decodedMessage._id);

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
