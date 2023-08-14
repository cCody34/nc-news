const db = require("../connection");

const readArticleByID = (article_id) => {
  if (isNaN(+article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article with this article_id not found",
        });
      } else {
        return rows[0];
      }
    });
};

module.exports = { readArticleByID };
