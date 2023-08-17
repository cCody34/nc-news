const express = require("express");
const { deleteComment } = require("../db/controllers/comments-controllers");
const commentsRouter = express.Router();

commentsRouter.route("/:comment_id").delete(deleteComment);

module.exports = commentsRouter;
