const { emitChatMessage } = require("../../utils/chat/event");
const { postChatMessage } = require("../../utils/chat/fetch");

/**
 * socket event에 대한 listener
 * @param {*} socket
 */
function setupChatListeners(socket) {
  // chat-message event 발생 시, 8080서버에 채팅 등록 api 요청 및 해당 room에 event emit
  socket.on("chat-message", (request) => {
    const chatroomUuid = request.uuid;
    const msg = request.message;
    // uuid가 없는 경우 에러 처리 필요
    if (!chatroomUuid) {
      console.error("chat-message Event Listener: chatroomUuid is missing");
      return;
    }

    postChatMessage(socket, chatroomUuid, msg).then((response) => {
      emitChatMessage(socket, chatroomUuid, response);
    });
  });
}

module.exports = { setupChatListeners };
