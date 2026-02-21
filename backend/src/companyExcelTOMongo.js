const XLSX = require("xlsx");
const path = require("path");
const companyStockModel = require("./models/companyStock.model");

const filePath = path.join(__dirname, "../public/LUCAS_STOCK.xlsx");

async function companyImportExcel() {
  const workbook = XLSX.readFile(filePath);

  for (let sheetName of workbook.SheetNames) {
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = sheetData.map((item) => ({
      sno: item["S.NO."],
      itemName: item.ITEMS,
      partno: item["PART NO."],
      description: item.DESCRIPTION,
      quantity: (() => {
        const value = item.QTY;
        if (!value) return 0;
        const cleaned = String(value).replace(/[^0-9.-]/g, "");
        return cleaned && !isNaN(cleaned) ? Number(cleaned) : 0;
      })(),
      mrp: (() => {
        const value = item.MRP;
        if (!value) return null;
        const cleaned = String(value).replace(/[^0-9.]/g, "");
        return cleaned && !isNaN(cleaned) ? Number(cleaned) : null;
      })(),
      sheetName: sheetName,
    }));

    const bulkOps = formattedData.map((item) => ({
      updateOne: {
        filter: { partno: item.partno },
        update: { $set: item },
        upsert: true,
      },
    }));

    await companyStockModel.bulkWrite(bulkOps)
  }

  console.log("Company Excel Sync Completed ✅");
}


module.exports = companyImportExcel;