const express = require("express");
const {
  getBoschPriceListController,
  getBoschPriceListDetailController,
} = require("../controllers/boschPriceList.controller");

const boschPriceListRoute = express.Router();

/**
 * /api/boschPriceList - GET request to fetch the Bosch price list data
 */
boschPriceListRoute.get("/", getBoschPriceListController);

/**
 * /api/boschPriceList/detail/:id - GET request to fetch the Bosch price list detail data
 */

boschPriceListRoute.get("/detail/:_id", getBoschPriceListDetailController);

module.exports = boschPriceListRoute;
