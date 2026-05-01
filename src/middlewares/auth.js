const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Please login");
    }
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
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
