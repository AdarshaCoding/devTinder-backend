const adminAuth = (req, res, next) => {
  const data = req.body;
  //   console.log(data.token);
  const isAuthorized = data.token === "abc123";
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("User Not Authorized!");
  }
};

module.exports = { adminAuth };
