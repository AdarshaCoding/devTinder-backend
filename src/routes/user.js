const express = require("express");
const { User } = require("../models/user");
const { ConnectionRequest } = require("../models/connectionRequest");
const { userAuth } = require("../middleware/auth");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age photoUrl gender about skills";
// Existing requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "skills",
    ]);

    if (!data) {
      return res.status(404).json({ message: "No Requests Found!" });
    }
    res.json(data);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//Connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (!connectionRequests) {
      return res.status(404).json({ message: "No record found!" });
    }

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
//Get all users feed
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    /**
     * Exclude:
     * loggedInUser should not come in feed for themself
     * status: ignored, rejected, accepted
     * already sent connection request
     */

    //collecting all the user id's who have sent request to me and I have sent to others
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set(); // to get the unique id's

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // fecthing the id's which are not in the hideUserFromFeed and loggedIn user from User Collection
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    // console.log(hideUsersFromFeed);

    res.send(users);
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while fetching the user details");
  }
});

module.exports = userRouter;
