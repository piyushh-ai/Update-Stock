const express = require("express");
const { boschStockController } = require("../controllers/boschStock.controller");


const boschStockRouter = express.Router();

/**
 * /api/boschStock - GET request to fetch the Bosch stock data
 */

boschStockRouter.get("/", boschStockController)

module.exports = boschStockRouter;