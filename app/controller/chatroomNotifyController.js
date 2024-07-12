const { emitUnreadCountUpdate } = require("../../socket/utils/chat/event");

/**
 * 특정 회원이 특정 채팅방에 입장했을 때 실행하는 메소드, 해당 회원에게 "unread-count-update" event emit
 * @param {*} io
 * @returns
 */
function notifyChatroomEnter(io) {
  return async (req, res) => {
    const { memberId, chatroomUuid } = req.body;

    let targetSocket = null;
    const sockets = await io.fetchSockets();
    for (const socket of sockets) {
      if (socket.memberId === memberId) {
        targetSocket = socket;
        break;
      }
    }

    if (targetSocket) {
      emitUnreadCountUpdate(targetSocket, chatroomUuid);
      res.sendStatus(200);
    } else {
      res.status(404).send("User not connected");
    }
  };
}

module.exports = (io) => {
  return {
    notifyChatroomEnter: notifyChatroomEnter(io),
  };
};
