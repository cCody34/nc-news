const { checkArticleExists } = require("../models/articles-model.js");
const {
  readCommentsByArticle,
  insertComment,
} = require("../models/comments-models.js");

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    readCommentsByArticle(article_id),
    checkArticleExists(article_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const commentToPost = req.body;
  const {username, body} = commentToPost
  const { article_id } = req.params;
  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch(next);
};
