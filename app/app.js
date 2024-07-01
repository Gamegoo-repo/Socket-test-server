const express = require("express");
const http = require("http");
const { join } = require("node:path");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { jwtSecret } = require("../config/config");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../public/index.html"));
});

app.post("/auth", (req, res) => {
  const token = req.body.token || req.headers.authorization.split(" ")[1];
  if (!token) {
    console.log("!token");
    return res.status(401).json({ authenticated: false });
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    //API 서버에서 발급받은 jwt를 여기서도 같은 secret key를 이용해 검증
    if (err) {
      console.log("token", token);
      console.log(err);
      return res.status(401).json({ authenticated: false });
    }
    res.json({ authenticated: true });
  });
});

module.exports = { app, server };
