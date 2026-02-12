const express = require("express");
const stockRouter = require("./bosch_stock/routes/stock.route");

app = express();
app.use(express.json());

app.use("/api/stock", stockRouter);

module.exports = app;
