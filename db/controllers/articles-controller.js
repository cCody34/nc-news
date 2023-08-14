const { readArticleByID } = require("../models/articles-model");

const getArticleByID = (req, res, next) => {
  const path = req.path;
  const article_id = path.slice(path.lastIndexOf("/") + 1);
  readArticleByID(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

module.exports = { getArticleByID };
