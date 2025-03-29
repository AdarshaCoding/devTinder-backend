const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("The token is not valid!!!!");
    }
    const decodedData = jwt.verify(token, "DEV_SECRET@123");
    const { _id } = decodedData;
    const user = await User.findById(_id);
    // console.log(user);
    if (!user) {
      throw new Error("User is not found!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
