const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //reference to the User Collection
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //reference to the User Collection
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is not supported for the status field!`,
    },
    required: true,
  },
});

// index - it helps in search when we have more data in database
// connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if fromUserId and touserId are same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Connection request cannot be send to yourself!");
  }
  next(); //DON'T FORGET THIS else the program control will stop here only
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = { ConnectionRequest };
