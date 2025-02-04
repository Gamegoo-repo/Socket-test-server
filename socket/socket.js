const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");

const initChat = require("./handlers/chat/chatInit");
const initAlarm = require("./handlers/alarm/alarmInit");
const initMatching = require("./handlers/matching/matchingInit");
const initFriend = require("./handlers/friend/friendInit");

const { emitMemberInfo } = require("./utils/login/event");
const { emitFriendOffline } = require("./utils/friend/event");
const { fetchFriends } = require("./utils/friend/fetch");
const { getSocketIdByMemberId } = require("./utils/common/memberSocketIdMapper");

function initializeSocket(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    if (!socket.memberId) {
      console.log("a user connected, memberId:", socket.memberId, "socketId:", socket.id);
    }

    // socket auth에서 JWT 토큰 추출
    const token = socket.handshake.auth.token;

    if (token) {
      // (#2-2) jwt 토큰 검증 및 socket 바인딩
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          console.log("Invalid token");
        } else {
          socket.memberId = decoded.memberId; // 해당 소켓 객체에 memberId 추가
          socket.token = token; // 해당 소켓 객체에 token 추가
          console.log("a user connected, memberId:", socket.memberId, "socketId:", socket.id);

          // (#2-3) "member-info" event emit
          emitMemberInfo(socket);

          // (#2-5) 초기화 함수들 호출
          initChat(socket, io);
          initAlarm(socket, io);
          initMatching(socket, io);
          initFriend(socket, io);
        }
      });
    } else {
      console.log("No token provided, 비로그인 사용자의 socket connection 입니다.");
    }

    // disconnect 시에 친구 소켓에게 friend-offline event emit
    socket.on("disconnect", async () => {
      console.log("DISCONNECTED, memberId: ", socket.memberId);

      // 해당 socket이 memberId를 가질 때에만(로그인한 소켓인 경우에만)
      if (socket.memberId) {
        // (#6-2) 친구 목록 조회 api 요청
        // (#6-3) 친구 목록 조회 성공 응답 받음
        fetchFriends(socket).then(async (friends) => {
          // 친구 중에서 현재 온라인인 친구의 소켓 id 및 memberId array 생성
          const friendIdList = friends.map((friend) => friend.memberId);

          // (#6-4) 친구 memberId로 socketId 찾기
          const friendSocketList = await getSocketIdByMemberId(io, friendIdList);

          // (#6-5) 친구 소켓에게 "friend-offline" event emit
          emitFriendOffline(io, friendSocketList, socket.memberId);
        });
      }
    });
  });

  return io;
}

module.exports = initializeSocket;
