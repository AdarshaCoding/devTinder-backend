const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateProfileEditData } = require("../utils/validate");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send(loggedInUser);
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    //Sanitize the user input data
    if (!validateProfileEditData(req)) {
      throw new Error("The update is not possible!!");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({ message: "The user updated successfully!", data: loggedInUser });
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

profileRouter.patch("/passwordUpdate", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const loggedInUser = req.user;
    //validate the current password
    const isCurrentPasswordValid = await loggedInUser.verifyPassword(
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is not valid!");
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newPasswordHash;
    await loggedInUser.save();

    // request for login again with new password
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.json({
      message: `${loggedInUser.firstName}, Your password has been successfully changed. Please use your new password to log in.`,
    });
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
