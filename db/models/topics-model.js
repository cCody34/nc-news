const db = require("../connection");

exports.readTopics = () => {
  return db.query("SELECT * FROM topics").then(({rows}) => {
    return rows
  });
};
