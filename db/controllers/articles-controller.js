const {
  readArticles,
  readArticleByID,
  editArticle,
  checkArticleExists,
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
  const promises = [
    editArticle(inc_votes, article_id),
    checkArticleExists(article_id),
  ];
  Promise.all(promises)
    .then((resolvedPromises) => {
      const updatedArticle = resolvedPromises[0];
      res.status(200).send(updatedArticle);
    })
    .catch(next);
};

module.exports = { getArticles, getArticleByID, updateArticle };
