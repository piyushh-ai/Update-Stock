const express = require('express');
const { rmpCatController } = require('../controllers/rmpCat.controller');

const rmpCatRouter = express.Router();

/**
 * /api/rmpCat - GET request to fetch the RMP catalog data
 */

rmpCatRouter.get('/', rmpCatController);

module.exports = rmpCatRouter;