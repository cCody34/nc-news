const db = require("../connection");

const readArticleByID = (article_id) => {
  if (!/\b\d+/g.test(article_id)) {
    return Promise.reject({ status: 400 , msg: "bad request"});
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { readArticleByID };
