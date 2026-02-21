const express = require("express");
const {
  getAllCompanyStockController,
  getCompanyStockSheetsController,
  getCompanyStockBySheetNameController,
} = require("../controllers/companyStock.controller");

const companyStockRouter = express.Router();

/**
 * /api/companyStock - GET request to fetch the company stock data
 */
companyStockRouter.get("/", getAllCompanyStockController);

/**
 * /api/companyStock/sheets - GET request to fetch the company name data
 */
companyStockRouter.get("/sheets", getCompanyStockSheetsController);

/**
 * /api/companyStock/sheets/:sheetName - GET request to fetch the company name data
 */
companyStockRouter.get(
  "/sheets/:sheetName",
  getCompanyStockBySheetNameController,
);

module.exports = companyStockRouter;
