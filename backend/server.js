const app = require("./src/app");
const boschImportExcel = require("./src/boschExcelToMongo");
const companyImportExcel = require("./src/companyExcelTOMongo");
const connectToDb = require("./src/config/db");
const boschAlternatorCat = require("./src/excelToMongo/boschAlternatorCat");
const boschStarterCat = require("./src/excelToMongo/boschStarterCat");

const port = 5000;

/**`
 * connect to the database and start the server
 */
connectToDb();

/**
 * import all stock data from the Excel file to MongoDB
 */
boschImportExcel()
companyImportExcel()


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
