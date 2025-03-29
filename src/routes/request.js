const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;
      const { status, toUserId } = req.params;

      // allowed status
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error(
          `This request not able to process with this status code: ${status}`
        );
      }
      const toUser = await User.findOne({ _id: toUserId });
      // If toUser not found in the database
      if (!toUser) {
        return res.status(404).send("The user is not found!");
      }

      // If duplciate request sent
      const isConnectionReqAlreadySent = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isConnectionReqAlreadySent) {
        return res.status(400).send("The connection request is already exist!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      await connectionRequest.save();

      res.json({
        message: `${loggedInUser.firstName} is ${status} in ${toUser.firstName}`,
      });
    } catch (err) {
      res.status(404).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    // stop if any random status requested
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: `This request is not able to process with status ${status}`,
      });
    }

    /**
     * Process one request at a time with requestId
     * LoggedIn user must have "interested" record for the requestId in the database then only they can accept or reject
     */
    const connectionReviewRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionReviewRequest) {
      return res.status(404).json({ message: "No request found!" });
    }
    connectionReviewRequest.status = status;
    const data = await connectionReviewRequest.save();
    res.json({ message: `The request is ${status} !!`, data });
  }
);

module.exports = requestRouter;
