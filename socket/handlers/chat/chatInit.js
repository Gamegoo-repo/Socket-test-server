const { handleChatEvents } = require("./chatHandler");

function initChat(socket, io) {
  handleChatEvents(socket, io);
}

module.exports = initChat;
