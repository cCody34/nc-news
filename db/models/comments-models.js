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
    ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (article_id, author, body) => {
  if (typeof author !== "string" || typeof body !== "string"){
    return Promise.reject({status: 400, msg: "bad request"})
  }
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
