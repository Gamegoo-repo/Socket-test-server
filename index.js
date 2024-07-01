// index.js
const { app, server } = require("./app/app");
const initializeSocket = require("./socket/socket");

initializeSocket(server);

server.listen(3000, () => {
  console.log("listening on *:3000");
});
