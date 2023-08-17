const express = require("express");
const { getTopics } = require("./db/controllers/topics-controller");
const {
  getArticles,
  getArticleByID,
  updateArticle,
} = require("./db/controllers/articles-controller");
const { getEndpoints } = require("./db/controllers/endpoints-controller.js");
const {
  handle400s,
  handle404s,
  handleCustomErrors,
} = require("./db/error-handlers/error.js");
const {
  getCommentsByArticle,
  postComment,
  deleteComment,
} = require("./db/controllers/comments-controllers.js");
const { getUsers } = require("./db/controllers/users-controllers");
const app = express();
const { topicsRouter } = require("./routers/topics-router");
const usersRouter = require("./routers/users-router");
const commentsRouter = require("./routers/comments-router");
const articlesRouter = require("./routers/articles-router");

app.use(express.json());

app.get("/api", getEndpoints);

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  res.status(404).send({ msg: "not found" });
});

app.use(handle400s);

app.use(handle404s);

app.use(handleCustomErrors);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: err });
});

module.exports = app;
