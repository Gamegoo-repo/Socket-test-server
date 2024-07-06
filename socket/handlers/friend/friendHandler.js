const { fetchFriends } = require("../../utils/friend/fetch");
const { emitFriendOnline } = require("../../utils/friend/event");

function handleFriendEvents(socket, io) {
  let friendIdList = [];

  fetchFriends(socket)
    .then((friends) => {
      friendIdList = friends.map((friend) => friend.memberId);
      emitFriendOnline(socket, io, friendIdList);
    })
    .catch((error) => {
      console.error("Error fetching friends data:", error);
    });
}

module.exports = { handleFriendEvents };
