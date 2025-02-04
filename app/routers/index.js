const express = require("express");
const { join } = require("node:path");
const path = require("path");

module.exports = (io) => {
  const router = express.Router();

  const { login } = require("../controller/loginController")(io); // io 객체를 전달
  const { logout } = require("../controller/logoutController")(io);

  router.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../../public/index.html"));
  });

  router.use("/img", express.static(path.join(__dirname, "../../public/img")));

  router.post("/login", login);

  router.post("/logout", logout);

  return router;
};
