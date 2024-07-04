const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

const initChat = require("./handlers/chat/chatInit");
const initAlarm = require("./handlers/alarm/alarmInit");
const initMatching = require("./handlers/matching/matchingInit");
const initFriend = require("./handlers/friend/friendInit");

function initializeSocket(server) {
  const io = socketIo(server);

  // //socket 요청마다 jwt 토큰을 검사하는 middleware
  // io.use((socket, next) => {
  //   const token = socket.handshake.headers["authorization"];
  //   if (token) {
  //     jwt.verify(token.split(" ")[1], jwtSecret, (err, decoded) => {
  //       if (err) {
  //         return next(new Error("Authentication error"));
  //       }
  //       socket.decoded = decoded;
  //       socket.memberId = decoded.memberId;

  //       next();
  //     });
  //   } else {
  //     next(new Error("Authentication error"));
  //   }
  // });

  io.on("connection", (socket) => {
    console.log("a user connected, memberId:", socket.memberId, "socketId:", socket.id);

    // 헤더에서 JWT 토큰 추출
    const token = socket.handshake.headers["authorization"]?.split(" ")[1];

    if (token) {
      // 토큰 검증
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          console.log("Invalid token");
          // socket.disconnect();
        } else {
          socket.memberId = decoded.memberId; // 토큰에 있는 정보를 소켓에 저장
          console.log("a user connected, memberId:", socket.memberId, "socketId:", socket.id);

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
