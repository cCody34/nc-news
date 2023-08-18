const express = require("express");
const {
  getArticles,
  getArticleByID,
  updateArticle,
  postArticle,
} = require("../db/controllers/articles-controller");
const {
  getCommentsByArticle,
  postComment,
} = require("../db/controllers/comments-controllers");
const articlesRouter = express.Router();

articlesRouter.route("").get(getArticles).post(postArticle);
articlesRouter.route("/:article_id").get(getArticleByID).patch(updateArticle);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

module.exports = articlesRouter;
