const { handleFriendEvents } = require("./friendHandler");

function initFriend(socket, io) {
  handleFriendEvents(socket, io);
}

module.exports = initFriend;
