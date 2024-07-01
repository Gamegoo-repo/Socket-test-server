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

  // // 연결된 모든 소켓의 socketId 출력하기
  // function printConnectedSocketIds() {
  //   const connectedSockets = io.sockets.sockets;
  //   console.log("==================== socket connections START ====================");
  //   connectedSockets.forEach((socket, key) => {
  //     console.log(`Socket ID: ${key}`);
  //     console.log(`member ID: ${socket.memberId}`);
  //   });
  //   console.log("==================== socket connections END ====================");
  // }

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

  // io.on("connection", (socket) => {
  //   console.log("a user connected, memberId:", socket.memberId, "socketId:", socket.id);
  //   let friendIdList = [];

  //   // Socket connection이 생성되면 localhost:8080/v1/member/friends로 GET 요청
  //   axios
  //     .get("http://localhost:8080/v1/member/friends", {
  //       headers: {
  //         Authorization: `Bearer ${socket.handshake.headers["authorization"].split(" ")[1]}`,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.data.isSuccess) {
  //         // 친구 목록 출력 및 friendIdList에 저장
  //         const friends = response.data.result.friendInfoDtoList;
  //         console.log(`== member ID: ${socket.memberId}, friend's member ID & Name list START ==`);
  //         friends.forEach((friend) => {
  //           console.log(`Friend ID: ${friend.memberId}, Name: ${friend.name}`);
  //           friendIdList.push(friend.memberId);
  //         });
  //         console.log(`== member ID: ${socket.memberId}, friend's member ID & Name list END ==`);
  //       } else {
  //         console.log("Failed to fetch friends:", response.data.message);
  //       }

  //       // 현재 socket 커넥션을 가진 친구 목록 출력 및 해당 socket 커넥션에 "friend-online" event를 emit
  //       console.log(`== member ID: ${socket.memberId}, friend's socket ID list START ==`);
  //       let connectedSockets = io.sockets.sockets;
  //       connectedSockets.forEach((connSocket, key) => {
  //         if (friendIdList.includes(connSocket.memberId)) {
  //           console.log(`MemberId: ${connSocket.memberId}, Key: ${key}`);
  //           io.to(key).emit("friend-online", socket.memberId);
  //         }
  //       });
  //       console.log(`== member ID: ${socket.memberId}, friend's socket ID list END ==`);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching friends data:", error);
  //     });

  //   // socket event listeners

  //   socket.on("printSocketIds", () => {
  //     printConnectedSocketIds();
  //   });

  //   socket.on("chat message", (msg) => {
  //     io.emit("chat message", msg);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("user disconnected");
  //   });
  // });
}

module.exports = initializeSocket;
