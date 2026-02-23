const express = require("express")
const getBoschPriceListController = require("../controllers/boschPriceList.controller")


const boschPriceListRoute = express.Router()

/**
 * /api/boschPriceList - GET request to fetch the Bosch price list data
 */
boschPriceListRoute.get("/", getBoschPriceListController)


module.exports = boschPriceListRoute