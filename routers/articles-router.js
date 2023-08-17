const express = require("express");
const {
  getArticles,
  getArticleByID,
  updateArticle,
} = require("../db/controllers/articles-controller");
const {
  getCommentsByArticle,
  postComment,
} = require("../db/controllers/comments-controllers");
const articlesRouter = express.Router();

articlesRouter.route("").get(getArticles);
articlesRouter.route("/:article_id").get(getArticleByID).patch(updateArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

module.exports = articlesRouter;
