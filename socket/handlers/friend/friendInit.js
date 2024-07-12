const { initializeFriend } = require("./friendInitializer");

function initFriend(socket, io) {
  initializeFriend(socket, io); // socket 초기화 즉시 실행할 메소드
}

module.exports = initFriend;
