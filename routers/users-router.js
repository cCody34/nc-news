const express = require("express");
const { getUsers } = require("../db/controllers/users-controllers");
const usersRouter = express.Router();

usersRouter.route("").get(getUsers);

module.exports = usersRouter;
