const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { jwtSecret } = require("../config/config");

const initChat = require("./handlers/chat/chatInit");
const initAlarm = require("./handlers/alarm/alarmInit");
const initMatching = require("./handlers/matching/matchingInit");
const initFriend = require("./handlers/friend/friendInit");

function initializeSocket(server) {
  const io = socketIo(server);

  //socket 요청마다 jwt 토큰을 검사하는 middleware
  io.use((socket, next) => {
    const token = socket.handshake.headers["authorization"];
    if (token) {
      jwt.verify(token.split(" ")[1], jwtSecret, (err, decoded) => {
        if (err) {
          return next(new Error("Authentication error"));
        }
        socket.decoded = decoded;
        socket.memberId = decoded.memberId;

        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("a user connected, memberId:", socket.memberId, "socketId:", socket.id);

    initChat(socket, io);
    initAlarm(socket, io);
    initMatching(socket, io);
    initFriend(socket, io);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = initializeSocket;
