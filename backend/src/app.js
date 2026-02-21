require("dotenv").config();
const express = require("express");
const cors = require("cors");
/**
 * all routes are imported here
 */
const rmpCatRouter = require("./routes/rmpCat.route");
const boschStockRouter = require("./routes/boschStock.route");
const boschAECatRouter = require("./routes/boschAECat.route.js");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/**
 * all catalog routes are defined here
 */
app.use("/api/rmpCat", rmpCatRouter);
app.use("/api/bosch-electric-cat", boschAECatRouter);

/**
 * all stock routes are defined here
 */

app.use("/api/boschStock", boschStockRouter);

module.exports = app;
