const { readArticleByID } = require("../models/articles-model");

const getArticleByID = (req, res, next) => {
  const {article_id} = req.params;
  readArticleByID(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
};

module.exports = { getArticleByID };
