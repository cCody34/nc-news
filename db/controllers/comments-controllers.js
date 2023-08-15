const { readCommentsByArticle } = require("../models/comments-models.js");

exports.getCommentsByArticle = (req, res, next) => {
    const {article_id} = req.params
    readCommentsByArticle(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch(next)
}