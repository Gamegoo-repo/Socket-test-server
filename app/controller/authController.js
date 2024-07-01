const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/config");

function authenticate(req, res) {
  const token = req.body.token || req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(401).json({ authenticated: false });
    }
    res.json({ authenticated: true });
  });
}

module.exports = {
  authenticate,
};
