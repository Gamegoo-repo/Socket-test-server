const { fetchFriends } = require("../../utils/friend/fetch");
const { emitFriendOnline, emitSetFriendList } = require("../../utils/friend/event");
const { getSocketIdByMemberId } = require("../../utils/common/memberSocketIdMapper");

/**
 * socket 초기화 즉시 실행될 메소드
 * @param {*} socket
 * @param {*} io
 */
function initializeFriend(socket, io) {
  fetchFriends(socket) // 해당 회원의 친구 목록 조회 api 요청
    .then(async (friends) => {
      // 친구 중에서 현재 온라인인 친구의 소켓 id 및 memberId array 생성
      const friendIdList = friends.map((friend) => friend.memberId);

      // 친구 memberId로 socketId 찾기
      const friendSocketList = await getSocketIdByMemberId(io, friendIdList);

      // 친구 소켓에게 "friend-online" event emit
      emitFriendOnline(io, friendSocketList, socket.memberId);

      // 이 소켓에게 "set-friend-list" event emit
      emitSetFriendList(socket, friendSocketList);
    })
    .catch((error) => {
      console.error("Error fetching friends data:", error);
    });
}

module.exports = { initializeFriend };
