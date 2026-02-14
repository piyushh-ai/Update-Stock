require("dotenv").config()
const express = require("express");
const cors = require("cors");
const stockRouter = require("./routes/stock.route");


app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use("/api/bosch", stockRouter)

module.exports = app;
