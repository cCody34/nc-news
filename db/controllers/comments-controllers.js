const { readCommentsByArticle } = require("../models/comments-models.js");

exports.getCommentsByArticle = (req, res, next) => {
    const {article_id} = req.params
    console.log(article_id, "id in controller")
    readCommentsByArticle(article_id).then((comments) => {
        res.status(200).send({comments})
    })
}