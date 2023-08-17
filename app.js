const express = require("express");
const {
  handle400s,
  handle404s,
  handleCustomErrors,
} = require("./db/error-handlers/error.js");
const app = express();
const { topicsRouter } = require("./routers/topics-router");
const usersRouter = require("./routers/users-router");
const commentsRouter = require("./routers/comments-router");
const articlesRouter = require("./routers/articles-router");
const apiRouter = require("./routers/api-router.js");

app.use(express.json());

app.use("/api", apiRouter)

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
