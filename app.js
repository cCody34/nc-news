const express = require("express");
const healthCheckController = require("./db/controllers/health-check-controller.js");
const { getTopics } = require("./db/controllers/topics-controller");
const { getArticleByID } = require("./db/controllers/articles-controller");
const { getEndpoints } = require("./db/controllers/endpoints-controller.js");
const app = express();

app.get("/api/healthcheck", healthCheckController);

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = app;
