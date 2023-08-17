const express = require("express");
const {
  deleteComment,
  updateComment,
} = require("../db/controllers/comments-controllers");
const commentsRouter = express.Router();

commentsRouter.route("/:comment_id").delete(deleteComment).patch(updateComment);

module.exports = commentsRouter;
