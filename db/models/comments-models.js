const db = require("../connection");

exports.readCommentsByArticle = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, author, body) => {
  return db
    .query(
      `INSERT INTO comments
      (article_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [article_id, author, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(() => {
      return;
    });
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows;
    });
};

exports.editComment = (inc_votes, comment_id) => {
  return db
    .query(
      `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
