const { fetchFriends } = require("../../utils/friend/fetch");
const { emitFriendOnline, emitSetFriendList } = require("../../utils/friend/event");

function initializeFriend(socket, io) {
  fetchFriends(socket) // 해당 회원의 친구 목록 조회 api 요청
    .then(async (friends) => {
      // 친구 중에서 현재 온라인인 친구의 소켓 id 및 memberId array 생성
      const friendIdList = friends.map((friend) => friend.memberId);
      let friendSocketList = [];
      const connectedSockets = await io.fetchSockets();

      console.log(`== member ID: ${socket.memberId}, friend's socket ID list START ==`);

      for (const connSocket of connectedSockets) {
        if (friendIdList.includes(connSocket.memberId)) {
          console.log(`MemberId: ${connSocket.memberId}, SocketId: ${connSocket.id}`);
          friendSocketList.push({ socketId: connSocket.id, memberId: connSocket.memberId });
        }
      }

      console.log(`== member ID: ${socket.memberId}, friend's socket ID list END ==`);

      // 친구 소켓에게 "friend-online" event emit
      emitFriendOnline(io, friendSocketList);

      // 이 소켓에게 "set-friend-list" event emit
      emitSetFriendList(socket, friendSocketList);
    })
    .catch((error) => {
      console.error("Error fetching friends data:", error);
    });
}

module.exports = { initializeFriend };
