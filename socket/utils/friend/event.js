const formatResponse = require("../common/responseFormatter");

/**
 * 친구 소켓에게 내가 온라인 상태를 알리는 메소드
 * @param {*} socket
 * @param {*} io
 * @param {*} friendIdList
 */
function emitFriendOnline(socket, io, friendIdList) {
  console.log(`== member ID: ${socket.memberId}, friend's socket ID list START ==`);
  // 현재 연결된 모든 소켓 리스트 조회
  const connectedSockets = io.sockets.sockets;

  connectedSockets.forEach((connSocket, key) => {
    // 연결된 모든 소켓 중, 친구의 소켓 찾기
    if (friendIdList.includes(connSocket.memberId)) {
      console.log(`MemberId: ${connSocket.memberId}, Key: ${key}`);

      // 친구 소켓에게 friend-online emit
      io.to(key).emit("friend-online", formatResponse(true, "friend-online", { memberId: socket.memberId }));
    }
  });
  console.log(`== member ID: ${socket.memberId}, friend's socket ID list END ==`);
}

/**
 * 내 소켓에게 친구 목록을 초기화해야함을 알리는 메소드
 * @param {*} socket
 * @param {*} friendIdList
 */
function emitSetFriendList(socket, friendIdList) {
  socket.emit("set-friend-list", formatResponse(true, "set-friend-list", { friendIdList }));
}

module.exports = {
  emitFriendOnline,
  emitSetFriendList,
};
