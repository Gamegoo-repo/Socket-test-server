const formatResponse = require("../../utils/common/responseFormatter");

function setupChatListeners(socket, io) {
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

module.exports = { setupChatListeners };
