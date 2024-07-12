const formatResponse = require("../common/responseFormatter");

/**
 * 친구 소켓에게 내가 온라인 상태를 알리는 메소드
 * @param {*} io
 * @param {*} friendSocketList
 * @param {*} memberId
 */
function emitFriendOnline(io, friendSocketList, memberId) {
  friendSocketList.forEach((friendSocket) => {
    // 친구 소켓에게 friend-online emit
    io.to(friendSocket.socketId).emit("friend-online", formatResponse("friend-online", { memberId }));
  });
}

/**
 * 내 소켓에게 온라인인 친구 목록을 초기화해야함을 알리는 메소드
 * @param {*} socket
 * @param {*} friendSocketList
 */
function emitSetFriendList(socket, friendSocketList) {
  const onlineFriendMemberIdList = friendSocketList.map((friend) => friend.memberId);
  socket.emit("set-friend-list", formatResponse("set-friend-list", { onlineFriendMemberIdList }));
}

module.exports = {
  emitFriendOnline,
  emitSetFriendList,
};
