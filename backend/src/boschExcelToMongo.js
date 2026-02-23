const XLSX = require("xlsx");
const path = require("path");
const boschStockModel = require("./models/boschStock.model");
const fs = require("fs")

const filePath = path.join(__dirname, "../public/BOSCH_STOCK1.xlsx");

async function boschImportExcel() {
  const workbook = XLSX.readFile(filePath);
  const stats = fs.statSync(filePath);
  const modifiedDate = stats.mtime;
  
  
  for (let sheetName of workbook.SheetNames) {
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = sheetData.map((item) => ({
      sno: item["S.NO."],
      itemName: item.ITEMS,
      partno: item["PART NO."],
      description: item.DESCRIPTION,
      quantity: item.QTY,
      mrp: item.MRP,
      sheetName: sheetName,
      modifiedDate : modifiedDate
    }));

    const bulkOps = formattedData.map((item) => ({
      updateOne: {
        filter: { partno: item.partno },
        update: { $set: item },
        upsert: true,
      },
    }));

    await boschStockModel.bulkWrite(bulkOps)
  }

  console.log("Bosch Excel Sync Completed ✅");
}


module.exports = boschImportExcel;