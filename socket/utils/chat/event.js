const formatResponse = require("../common/responseFormatter");

function emitChatMessage(io, msg) {
  io.emit("chat-message", formatResponse("chat-message", { msg }));
}

function emitUnreadCountUpdate(socket, chatroomUuid) {
  socket.emit("unread-count-update", formatResponse("unread-count-update", { chatroomUuid, newCount: 0 }));
}

module.exports = {
  emitChatMessage,
  emitUnreadCountUpdate,
};
