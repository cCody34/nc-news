const express = require("express");
const {
  getUsers,
  getUserByUsername,
} = require("../db/controllers/users-controllers");
const usersRouter = express.Router();

usersRouter.route("").get(getUsers);

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
