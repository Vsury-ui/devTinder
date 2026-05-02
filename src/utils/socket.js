const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (targetUserId, userId) => {
  return crypto
    .createHash("sha256")
    .update([targetUserId, userId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, targetUserId, userId }) => {
      const chatRoomId = getSecretRoomId(targetUserId, userId);
      console.log(firstName + "Joined roomId: " + chatRoomId);
      socket.join(chatRoomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, targetUserId, userId, text }) => {
        try {
          const roomId = getSecretRoomId(targetUserId, userId);
          console.log(
            firstName +
              " " +
              lastName +
              " Sent message " +
              text +
              " to roomId: " +
              roomId,
          );

          // Check if userId and targetUserId are friends before allowing to send message
          const connectionRequest = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });

          if (!connectionRequest) {
            io.to(roomId).emit("error", {
              message: "You can only message users you are connected with",
            });
            return;
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();

          io.to(roomId).emit("receiveMessage", {
            firstName,
            lastName,
            text,
          });
        } catch (err) {
          console.error("Error sending message:", err.message);
        }
      },
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
