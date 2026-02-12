const XLSX = require("xlsx");
const stockModel = require("./models/stock.model");
const path = require("path");

const filePath = path.join(__dirname, "../public/BOSCH_STOCK1.xlsx");

async function boschImportExcel() {
  const workbook = XLSX.readFile(filePath);
  for (let sheetName of workbook.SheetNames) {
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = sheetData.map((item) => ({
      sno: item["S.NO."],
      itemName: item.ITEMS,
      partNo: item["PART NO."],
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
      companyName: sheetName,
    }));
    await stockModel.insertMany(formattedData);
  }
}

module.exports = boschImportExcel;
