const express = require("express");
const { getTopics } = require("./db/controllers/topics-controller");
const { getArticleByID } = require("./db/controllers/articles-controller");
const { getEndpoints } = require("./db/controllers/endpoints-controller.js");
const {
  handle400s,
  handleCustomErrors,
} = require("./db/error-handlers/error.js");
const {
  getCommentsByArticle,
} = require("./db/controllers/comments-controllers.js");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.use(handle400s);

app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = app;
