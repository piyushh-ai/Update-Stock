const express = require("express");
const {
  boschStarterCatController,
  boschAlternatorCatController,
} = require("../controllers/boschElectricCat.controller");

const boschAECatRouter = express.Router();

/**
 * /api/bosch-electric-cat/starter - GET request to fetch the Bosch starter motor catalog data
 */

boschAECatRouter.get("/starter", boschStarterCatController);

/**
 * /api/bosch-electric-cat/alternator - GET request to fetch the Bosch alternator catalog data
 */

boschAECatRouter.get("/alternator", boschAlternatorCatController)

module.exports = boschAECatRouter;
