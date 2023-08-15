const { checkArticleExists } = require("../models/articles-model.js");
const { readCommentsByArticle } = require("../models/comments-models.js");

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
