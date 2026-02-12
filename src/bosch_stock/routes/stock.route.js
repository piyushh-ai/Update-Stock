const express = require("express");
const XLSX = require("xlsx");
const path = require("path");

const filePath = path.join(__dirname, "../../../public/BOSCH_STOCK1.xlsx");

const stockRouter = express.Router();

stockRouter.get("/getStock", (req, res) => {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.SheetNames;
  let finalData = [];
  sheet.forEach((SheetNames) => {
    const sheet = workbook.Sheets[SheetNames];
    const data = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    for (let i = 1; i < data.length; i++) {
      const rows = data[i];
      if (!rows[1]) continue;

      finalData.push({
        sno: data.length + 1,
        part: String(rows[1]).trim(),
        item: String(rows[2]).trim(),
        desc: String(rows[3]).trim(),
        qty: String(rows[4]).trim(),
        mrp: String(rows[5]).trim(),
        sheetname: SheetNames,
      });
    }
  });

  res.send(finalData);
});

module.exports = stockRouter;
