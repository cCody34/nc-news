const express = require("express");
const { getEndpoints } = require("../db/controllers/endpoints-controller");
const apiRouter = express.Router();

apiRouter.route("").get(getEndpoints);

module.exports = apiRouter;
