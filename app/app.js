const express = require("express");
const http = require("http");
const cors = require("cors");
const routes = require("./routers/index");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/", routes);

module.exports = { app, server };
