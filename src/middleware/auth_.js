const userAuth = (req, res, next) => {
  const token = "xyz123";
  const isUserAuthorized = token === "xyz123";
  if (!isUserAuthorized) {
    res.status(401).send("User is not authorized!");
  } else {
    next();
  }
};

const adminAuth = (req, res, next) => {
  const token = "xy123";
  const isUserAuthorized = token === "xyz123";
  if (!isUserAuthorized) {
    res.status(401).send("Admin is not authorized!");
  } else {
    next();
  }
};

module.exports = { userAuth, adminAuth };
