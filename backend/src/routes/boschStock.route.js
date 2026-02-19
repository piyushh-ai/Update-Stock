const express = require("express");
const { boschStockController } = require("../controllers/boschStock.controller");


const boschStockRouter = express.Router();

boschStockRouter.get("/", boschStockController)

module.exports = boschStockRouter;