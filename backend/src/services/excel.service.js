// services/excel.service.js

const XLSX = require("xlsx");
const fs = require("fs");

async function importExcel(filePath, model) {
  const workbook = XLSX.readFile(filePath);
  const stats = fs.statSync(filePath);
  const modifiedDate = stats.mtime;

  for (let sheetName of workbook.SheetNames) {
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = sheetData
      .map((item) => {
        // ⚠️ validation
        if (!item["PART NO."]) return null;

        return {
          sno: item["S.NO."],
          itemName: item.ITEMS,
          partno: item["PART NO."],
          description: item.DESCRIPTION,
          quantity: item.QTY,
          mrp: item.MRP,
          sheetName,
          modifiedDate,
        };
      })
      .filter(Boolean);

    const bulkOps = formattedData.map((item) => ({
      updateOne: {
        filter: { partno: item.partno },
        update: { $set: item },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await model.bulkWrite(bulkOps);
    // console.log(bulkOps);
    
    }
  }
}

module.exports = { importExcel };
