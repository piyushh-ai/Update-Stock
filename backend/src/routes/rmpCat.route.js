const express = require('express');
const { rmpCatController } = require('../controllers/rmpCat.controller');

const rmpCatRouter = express.Router();

rmpCatRouter.get('/', rmpCatController);

module.exports = rmpCatRouter;