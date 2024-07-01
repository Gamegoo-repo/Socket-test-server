const express = require("express");
const router = express.Router();
const { join } = require("node:path");
const { authenticate } = require("../controller/authController");

router.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../../public/index.html"));
});

router.post("/auth", authenticate);

module.exports = router;
