const db = require("../connection");

exports.readComments = () => {
    return db.query(`SELECT * FROM comments;`).then(({rows}) => {
        return rows
    })
}
