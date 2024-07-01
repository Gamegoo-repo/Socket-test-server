const { fetchFriends } = require("../../utils/friend/fetch");
const { notifyFriendsOnline } = require("../../utils/friend/event");

function handleFriendEvents(socket, io) {
  let friendIdList = [];

  fetchFriends(socket)
    .then((friends) => {
      friendIdList = friends.map((friend) => friend.memberId);
      notifyFriendsOnline(socket, io, friendIdList);
    })
    .catch((error) => {
      console.error("Error fetching friends data:", error);
    });
}

module.exports = { handleFriendEvents };
