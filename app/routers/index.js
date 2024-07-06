const express = require("express");
const { join } = require("node:path");

module.exports = (io) => {
  const router = express.Router();

  const { login } = require("../controller/loginController")(io); // io 객체를 전달

  router.get("/", (req, res) => {
    res.sendFile(join(__dirname, "../../public/index.html"));
  });

  router.post("/login", login);

  return router;
};
