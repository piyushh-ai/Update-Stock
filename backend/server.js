const app = require("./src/app");
const boschImportExcel = require("./src/boschExcelToMongo");
const connectToDb = require("./src/config/db");
const boschAlternatorCat = require("./src/excelToMongo/boschAlternatorCat");
const boschStarterCat = require("./src/excelToMongo/boschStarterCat");

connectToDb();
boschImportExcel()
app.listen(3000, () => {
  console.log("server running on port 3000");
});
