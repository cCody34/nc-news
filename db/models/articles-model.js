const db = require("../connection");

const readArticles = () => {
  return db.query(`SELECT * FROM articles ORDER BY created_at DESC;`).then(({ rows }) => {
    rows.forEach((article) => {
      delete article.body;
    });
    return rows;
  });
};

const readArticleByID = (article_id) => {
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

module.exports = { readArticles, readArticleByID };
