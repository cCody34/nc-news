exports.handle400s = (err, req, res, next) => {
  console.log(err);
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.constraint === "comments_author_fkey" ||
    err.constraint === "comments_body_fkey"
  ) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  if (err.constraint === "comments_article_id_fkey") {
    res.status(404).send({ msg: "not found" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
