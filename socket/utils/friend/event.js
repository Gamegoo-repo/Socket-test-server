// 친구들에게 온라인 상태를 알리는 함수
function notifyFriendsOnline(socket, io, friendIdList) {
  console.log(`== member ID: ${socket.memberId}, friend's socket ID list START ==`);
  const connectedSockets = io.sockets.sockets;
  connectedSockets.forEach((connSocket, key) => {
    if (friendIdList.includes(connSocket.memberId)) {
      console.log(`MemberId: ${connSocket.memberId}, Key: ${key}`);
      io.to(key).emit("friend-online", socket.memberId);
    }
  });
  console.log(`== member ID: ${socket.memberId}, friend's socket ID list END ==`);
}

module.exports = {
  notifyFriendsOnline,
};
