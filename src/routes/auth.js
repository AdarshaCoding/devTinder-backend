const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validate");
const { User } = require("../models/user");

const appRouter = express.Router();

appRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId: emailId.toLowerCase(),
      password: passwordHash,
      age,
      gender,
    });
    await user.save();
    res.send(`${user.firstName} Added Succssfully!`);
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

appRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials!");
    }

    const isPasswordCorrect = await user.verifyPassword(password);

    if (isPasswordCorrect) {
      const secretData = await user.getJWT();
      res.cookie("token", secretData);

      res.send(user.firstName + " Login successfull!");
    } else {
      throw new Error("Invalid Credential!");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

appRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful!");
});

module.exports = appRouter;
