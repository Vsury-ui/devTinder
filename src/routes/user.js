const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { connect } = require("mongoose");

const userRouter = express.Router();

const USER_SAFE_FIELDS =
  "firstName lastName email age gender about skills photoUrl";

// Get all pending connection requests for the authenticated user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUserId,
        status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName age gender about skills photoUrl",
      );
    if (connectionRequests.length === 0) {
      return res.json({
        message: "No pending connection requests found for the user.",
        data: [],
      });
    }
    res.json({
      message: "Pending connection requests retrieved successfully.",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await connectionRequest
      .find({
        $or: [
          {
            fromUserId: loggedInUserId,
            status: "accepted",
          },
          {
            toUserId: loggedInUserId,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", USER_SAFE_FIELDS)
      .populate("toUserId", USER_SAFE_FIELDS);

    const connections = connectionRequests.map((request) => {
      if (request.fromUserId._id.toString() === loggedInUserId.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });

    res.json({
      message: "Connections retrieved successfully.",
      data: connections,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    // get the logged in user's id
    const loggedInUserId = req.user._id;
    // get all connection requests where the logged in user is either the sender or receiver
    const connectionRequests = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      })
      .select("fromUserId toUserId");
    // create a set of userIds that are connected to the logged in user
    const connectedUserIds = new Set();
    connectionRequests.forEach((request) => {
      connectedUserIds.add(request.fromUserId.toString());
      connectedUserIds.add(request.toUserId.toString());
    });
    // get all users that are not connected to the logged in user and not the logged in user themselves
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(connectedUserIds) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select(USER_SAFE_FIELDS)
      .skip(skip)
      .limit(limit);
    // return the users as the feed
    res.json({
      message: "Feed retrieved successfully.",
      data: users,
    });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

module.exports = userRouter;
