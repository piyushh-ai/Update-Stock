const express = require("express");
const stockRouter = require("./bosch_stock/routes/stock.route");
const cors = require("cors");


app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/stock", stockRouter);

module.exports = app;
