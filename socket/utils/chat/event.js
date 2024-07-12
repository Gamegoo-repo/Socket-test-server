const formatResponse = require("../common/responseFormatter");

/**
 * uuid에 해당하는 room에 있는 socket 중 나를 제외한 socket에 broadcast
 * @param {*} socket
 * @param {*} chatroomUuid
 * @param {*} data
 */
function emitChatMessage(socket, chatroomUuid, data) {
  //io.emit("chat-message", formatResponse("chat-message", { msg }));
  data.chatroomUuid = chatroomUuid;
  socket.broadcast.to("CHAT_" + chatroomUuid).emit("chat-message", formatResponse("chat-message", data));
}

function emitUnreadCountUpdate(socket, chatroomUuid) {
  socket.emit("unread-count-update", formatResponse("unread-count-update", { chatroomUuid, newCount: 0 }));
}

module.exports = {
  emitChatMessage,
  emitUnreadCountUpdate,
};
