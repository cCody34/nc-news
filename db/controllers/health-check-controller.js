const healthCheckController = (req, res, next) => {
  res.status(200).send({ msg: "server is running" });
};
module.exports = healthCheckController;
