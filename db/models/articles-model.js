const db = require("../connection");
const { sort } = require("../data/test-data/articles");

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.readArticles = (topic, sort_by = "created_at", order = "desc") => {
  const acceptedOrders = ["asc", "desc"];
  const acceptedSorts = [
    "article_id",
    "title",
    "topic",
    "author",
    "article_img_url",
    "created_at",
    "votes",
    "comment_count",
  ];
  if (!acceptedSorts.includes(sort_by) || !acceptedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let baseSqlString = `SELECT articles.article_id,
                        articles.title,
                        articles.topic,
                        articles.author,
                        articles.article_img_url,
                        articles.created_at,
                        articles.votes,
                        COUNT(comments.article_id) :: INT AS comment_count
                      FROM articles 
                      LEFT JOIN comments
                      ON articles.article_id=comments.article_id`;
  const queryValues = [];
  if (topic) {
    baseSqlString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }
  baseSqlString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  return db.query(baseSqlString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.readArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
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
