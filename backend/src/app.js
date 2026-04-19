require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression")

/**
 * all routes are imported here
 */
const rmpCatRouter = require("./routes/rmpCat.route");
const boschStockRouter = require("./routes/boschStock.route");
const boschAECatRouter = require("./routes/boschAECat.route.js");
const companyStockRouter = require("./routes/companyStock.routes.js");
const boschFilterRoute = require("./routes/boschFilter.route.js");
const autolekFilterRoute = require("./routes/autolekFilter.route.js");
const boschPriceListRoute = require("./routes/boschPriceList.route.js");
const router = require("./routes/upload.route.js");
// const dist = require("../dist");
// const distHtml = require("../dist/index.html");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(compression())

/**
 * all catalog routes are defined here
 */
app.use("/api/rmpCat", rmpCatRouter);
app.use("/api/bosch-electric-cat", boschAECatRouter);
app.use("/api/bosch-filters", boschFilterRoute);
app.use("/api/autolek-filters", autolekFilterRoute);

/**
 * all price list routes are defined here
 */
app.use("/api/boschPriceList", boschPriceListRoute);

/**
 * all stock routes are defined here
 */
app.use("/api/boschStock", boschStockRouter);
app.use("/api/companyStock", companyStockRouter);
app.use("/api/excel", router)

app.get("/version", (req, res) => {
  res.json({ version: "2.0.3", updateUrl:"https://drive.google.com/file/d/1aaOhI0ATH80_R8V8nfJLhCbyxVSFMBlZ/view?usp=drive_link", forceUpdate:true });
});

const distPath = path.join(__dirname, "../dist");

/**
 * frontend linking
 */
app.use(express.static(distPath));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});


module.exports = app;
