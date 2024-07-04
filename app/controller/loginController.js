const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/config");

const initChat = require("../../socket/handlers/chat/chatInit");
const initAlarm = require("../../socket/handlers/alarm/alarmInit");
const initMatching = require("../../socket/handlers/matching/matchingInit");
const initFriend = require("../../socket/handlers/friend/friendInit");

function login(io) {
  return (req, res) => {
    // "Authorization" 헤더에서 JWT 토큰 추출
    const authorizationHeader = req.headers["authorization"];
    let jwtToken = null;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      jwtToken = authorizationHeader.substring(7); // 'Bearer ' 이후의 부분이 토큰임
    }

    // jwt token 검증
    if (!jwtToken) {
      return res.status(401).json({ authenticated: false });
    }

    // JWT 토큰을 검증하고 memberId를 추출
    jwt.verify(jwtToken, jwtSecret, (err, decoded) => {
      if (err) {
        console.error("Error verifying token:", err);
        return res.status(401).json({ authenticated: false });
      }

      const memberId = decoded.memberId; // JWT 토큰에서 memberId 추출

      // "Socket-Id" 헤더에서 클라이언트 소켓 ID 추출
      const socketId = req.headers["socket-id"];

      // Socket.IO를 통해 클라이언트 소켓을 찾고 memberId를 추가
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.memberId = memberId; // 해당 소켓에 memberId 추가
        console.log(`Added memberId ${memberId} to socket ${socketId}`);
      } else {
        console.error(`Socket ${socketId} not found or disconnected.`);
      }

      // 추가적인 로직 수행 및 응답 처리

      // 초기화 함수들 호출
      initChat(socket, io);
      initAlarm(socket, io);
      initMatching(socket, io);
      initFriend(socket, io);

      res.status(200).json({ authenticated: true });
    });
  };
}

module.exports = (io) => {
  return {
    login: login(io),
  };
};
