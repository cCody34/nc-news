const express = require("express");
const { getTopics } = require("../db/controllers/topics-controller");
const topicsRouter = express.Router();

topicsRouter.route("").get(getTopics);

module.exports = {topicsRouter};