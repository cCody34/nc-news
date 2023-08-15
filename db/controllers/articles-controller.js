const { readArticles, readArticleByID } = require("../models/articles-model");

const getArticles = (req, res, next) => {
  return readArticles().then((articles) => {
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
