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
      targetSocket.emit("unread-count-update", { chatroomUuid, newCount: 0 });
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
