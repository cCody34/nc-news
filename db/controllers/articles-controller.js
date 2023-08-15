const {
  readArticles,
  readArticleByID,
  editArticle,
} = require("../models/articles-model");

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

const updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  const { inc_votes } = body;
  editArticle(inc_votes, article_id).then((updatedArticle) => {
    res.status(201).send(updatedArticle)
  });
};

module.exports = { getArticles, getArticleByID, updateArticle };
