const { fetchChatroomUuid } = require("../../utils/chat/fetch");

/**
 * socket 초기화 즉시 실행될 메소드
 * @param {*} socket
 * @param {*} io
 */
function initializeChat(socket, io) {
  // 소켓 초기화 즉시, API서버로 채팅방 uuid 목록 조회 요청 실행
  fetchChatroomUuid(socket).then((uuidList) => {
    console.log("======================= chatroom uuid List START =======================");
    // uuidList는 ["05063951-6da7-4dbb-9134-3f8a7b6f8590", ...] 형태의 UUID 문자열 목록
    uuidList.forEach((uuid) => {
      socket.join("CHAT_" + uuid);
    });
    const rooms = Array.from(socket.rooms);
    console.log("현재 소켓이 join되어 있는 room 목록:", rooms);
    console.log("======================= chatroom uuid List END =======================");
  });
}

module.exports = { initializeChat };
