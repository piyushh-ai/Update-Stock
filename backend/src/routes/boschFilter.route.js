const express = require("express");
const { getAllBoschFilters, getAllBoschCvFilter } = require("../controllers/boschFIlter.controller");

const boschFilterRoute = express.Router();

/**
 * @route GET /api/bosch-filters to get all Bosch filters
 * @access Public
 */
boschFilterRoute.get("/", getAllBoschFilters)

/**
 * @route GET /api/bosch-filters/cv to get all Bosch filters
 * @access Public
 */
boschFilterRoute.get("/cv", getAllBoschCvFilter)

module.exports = boschFilterRoute;