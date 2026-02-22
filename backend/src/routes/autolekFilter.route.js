const express = require("express");
const { getautolekFilter } = require("../controllers/autolekFilter.controller");

const autolekFilterRoute = express.Router();

/**
 * @route GET /api/autolek-filters to get all Autolek filters
 * @access Public
 */
autolekFilterRoute.get("/", getautolekFilter)


module.exports = autolekFilterRoute;