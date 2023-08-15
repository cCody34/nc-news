const { readArticles, readArticleByID } = require("../models/articles-model");
const { readComments } = require("../models/comments-models");

const getArticles = (req, res, next) => {
  const promises = [readArticles(), readComments()];
  return Promise.all(promises).then(([articles, comments]) => {
    articles.forEach((article) => {
      const articleComments = comments.filter((comment) => {
        return comment.article_id === article.article_id;
      });
      article.comment_count = articleComments.length
    });
    res.status(200).send({ articles });
  });
};

const getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  readArticleByID(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

module.exports = { getArticles, getArticleByID };
