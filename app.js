const express = require("express");
const healthCheckController = require("./db/controllers/health-check-controller.js");

const app = express();
app.use(express.json());

app.get("/api/healthcheck", healthCheckController);

module.exports = app;
