const { emitChatMessage } = require("../../utils/chat/event");

/**
 * socket event에 대한 listener
 * @param {*} socket
 * @param {*} io
 */
function setupChatListeners(socket, io) {
  // chat-message event 발생 시, io 전체에게 msg emit // 나중에 수정해야함
  socket.on("chat-message", (msg) => {
    emitChatMessage(io, msg);
  });
}

module.exports = { setupChatListeners };
