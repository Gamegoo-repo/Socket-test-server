const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

const initChat = require("./handlers/chat/chatInit");
const initAlarm = require("./handlers/alarm/alarmInit");
const initMatching = require("./handlers/matching/matchingInit");
const initFriend = require("./handlers/friend/friendInit");

function initializeSocket(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("a user connected, memberId:", socket.memberId, "socketId:", socket.id);

    // socket auth에서 JWT 토큰 추출
    const token = socket.handshake.auth.token;

    if (token) {
      // 토큰 검증
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          console.log("Invalid token");
          // socket.disconnect();
        } else {
          socket.memberId = decoded.memberId; // 해당 소켓 객체에 memberId 추가
          socket.token = token; // 해당 소켓 객체에 token 추가
          console.log("a user connected, memberId:", socket.memberId, "socketId:", socket.id);

          socket.emit("member-info", socket.memberId);

          // 초기화 함수들 호출
          initChat(socket, io);
          initAlarm(socket, io);
          initMatching(socket, io);
          initFriend(socket, io);
        }
      });
    } else {
      console.log("No token provided, 비로그인 사용자의 socket connection 입니다.");
      //socket.disconnect();
    }

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
}

module.exports = initializeSocket;
