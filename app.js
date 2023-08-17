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

app.use(express.json());

app.get("/api", getEndpoints);

app.use("/api/topics", topicsRouter);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.patch("/api/articles/:article_id", updateArticle);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.use("/api/users", usersRouter)

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
