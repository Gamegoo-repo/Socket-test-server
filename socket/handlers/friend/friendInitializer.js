const { fetchFriends } = require("../../utils/friend/fetch");
const { emitFriendOnline, emitSetFriendList } = require("../../utils/friend/event");

function initializeFriend(socket, io) {
  let friendIdList = [];

  fetchFriends(socket) // 해당 회원의 친구 목록 조회 api 요청
    .then((friends) => {
      friendIdList = friends.map((friend) => friend.memberId);

      // 친구 소켓에게 "friend-online" event emit
      emitFriendOnline(socket, io, friendIdList);

      // 이 소켓에게 "set-friend-list" event emit
      emitSetFriendList(socket, friendIdList);
    })
    .catch((error) => {
      console.error("Error fetching friends data:", error);
    });
}

module.exports = { initializeFriend };
