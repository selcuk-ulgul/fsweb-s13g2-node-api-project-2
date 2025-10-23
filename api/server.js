const express = require("express");

const server = express();

const router = require("./posts/posts-router");
server.use(express.json());



server.use("/api/posts", router);

module.exports = server;