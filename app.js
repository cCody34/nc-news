const express = require("express");
const healthCheckController = require("./db/controllers/health-check-controller.js");
const { getTopics } = require("./db/controllers/topics-controller");
const data = require("./db/data/development-data");

const app = express();
app.use(express.json());

app.get("/api/healthcheck", healthCheckController);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = app;
