const db = require("../connection");

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.readArticles = () => {
  return db
    .query(
      `SELECT articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.article_img_url,
        articles.created_at,
        articles.votes,
        COUNT(+comments.article_id) :: INT AS comment_count
      FROM articles 
      LEFT JOIN comments
      ON articles.article_id=comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.readArticleByID = (article_id) => {
  return db
    .query(
      `SELECT articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.article_img_url,
        articles.created_at,
        articles.votes,
        articles.body,
        COUNT(+comments.article_id) :: INT AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id=comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
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

exports.editArticle = (inc_votes, article_id) => {
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
