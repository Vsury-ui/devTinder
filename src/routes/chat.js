const express = require("express");
const chatRouter = express.Router();
const Chat = require("../models/chat");
const user = require("../models/user");
const { userAuth } = require("../middlewares/auth");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({ path: "messages.senderId", select: "firstName lastName" });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
    }
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error("Error fetching chat history:", err.message);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

module.exports = chatRouter;
