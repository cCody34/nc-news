const db = require("../connection");

exports.readCommentsByArticle = (article_id) => {
    console.log(article_id, "<<<id in model");
  return db.query(
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
  ).then(({rows}) => {
    return rows
  });
};
