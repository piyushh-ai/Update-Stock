require("dotenv").config();
const express = require("express");
const cors = require("cors");

/**
 * all routes are imported here
 */
const rmpCatRouter = require("./routes/rmpCat.route");
const boschStockRouter = require("./routes/boschStock.route");
const boschAECatRouter = require("./routes/boschAECat.route.js");
const companyStockRouter = require("./routes/companyStock.routes.js");
const boschFilterRoute = require("./routes/boschFilter.route.js");
const autolekFilterRoute = require("./routes/autolekFilter.route.js");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.get("/test", (req, res) => {
  res.json({ working: true });
});

/**
 * all catalog routes are defined here
 */
app.use("/api/rmpCat", rmpCatRouter);
app.use("/api/bosch-electric-cat", boschAECatRouter);
app.use("/api/bosch-filters", boschFilterRoute)
app.use("/api/autolek-filters", autolekFilterRoute)

/**
 * all stock routes are defined here
 */
app.use("/api/boschStock", boschStockRouter);
app.use("/api/companyStock", companyStockRouter);

module.exports = app;
