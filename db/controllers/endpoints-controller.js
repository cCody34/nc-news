const fs = require("fs/promises");

const getEndpoints = (req, res, next) => {
  fs.readFile(
    "endpoints.json"
  ).then((response) => {
    const JSONres = JSON.parse(response);
    res.status(200).send(JSONres)
  });
};

module.exports = { getEndpoints };
