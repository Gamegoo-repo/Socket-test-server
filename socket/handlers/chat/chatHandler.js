const formatResponse = require("../../utils/common/responseFormatter");
const { fetchChatroomUuid } = require("../../utils/chat/fetch");

function handleChatEvents(socket, io) {
  // 소켓 초기화 즉시, API서버로 채팅방 uuid 목록 조회 요청 실행
  fetchChatroomUuid(socket).then((uuidList) => {
    // uuidList는 ["05063951-6da7-4dbb-9134-3f8a7b6f8590", ...] 형태의 UUID 문자열 목록
    uuidList.forEach((uuid) => {
      socket.join(uuid);
    });
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", formatResponse(true, "success", { msg: msg }));
  });

  socket.on("printSocketIds", () => {
    printConnectedSocketIds(io);
  });
}

function printConnectedSocketIds(io) {
  const connectedSockets = io.sockets.sockets;
  console.log("== Connected Sockets ==");
  connectedSockets.forEach((connSocket, key) => {
    console.log(`Socket ID: ${key}, Member ID: ${connSocket.memberId}`);
  });
}

module.exports = { handleChatEvents };
