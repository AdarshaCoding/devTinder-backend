const express = require("express");
const { User } = require("../models/user");

const userRouter = express.Router();

//Get all users feed
userRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length == 0) {
      res.status(404).send("User not found!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while fetching the user details");
  }
});

module.exports = userRouter;
