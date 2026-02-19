require("dotenv").config()
const express = require("express");
const cors = require("cors");
const rmpCatRouter = require("./routes/rmpCat.route");
const boschStockRouter = require("./routes/boschStock.route");


app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/rmpCat", rmpCatRouter);
app.use("/api/boschStock", boschStockRouter);



module.exports = app;
