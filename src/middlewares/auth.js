const adminAuth = (req, res, next) => {
  console.log("Admin middleware executed");
  const token = "xyz";
  const isAuthenticated = token === "xyz";
  if (isAuthenticated) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { adminAuth };
