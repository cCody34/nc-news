const express = require("express");
const healthCheckController = require("./db/controllers/health-check-controller.js");
const { getTopics } = require("./db/controllers/topics-controller");
const { getEndpoints } = require("./db/controllers/endpoints-controller.js");
const app = express();

app.get("/api/healthcheck", healthCheckController);

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = app;
