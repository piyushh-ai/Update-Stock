const express = require("express");
const { getAllBoschFilters } = require("../controllers/boschFIlter.controller");

const boschFilterRoute = express.Router();

/**
 * @route GET /api/bosch-filters to get all Bosch filters
 * @access Public
 */
boschFilterRoute.get("/", getAllBoschFilters)

module.exports = boschFilterRoute;