const express = require("express");
const XLSX = require("xlsx");
const path = require("path");

const filePath = path.join(__dirname, "../../../public/BOSCH_STOCK1.xlsx");

const stockRouter = express.Router();

stockRouter.get("/search", (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).send("Search query required");
  }

  const searchWords = query
    .toLowerCase()
    .trim()
    .split(" ")
    .filter((word) => word !== "");

  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  let results = [];

  for (let name of sheetNames) {
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    for (let i = 1; i < data.length; i++) {
      const part = String(data[i][1]).trim();
      const item = String(data[i][2]).trim();
      const desc = String(data[i][3]).trim();
      const qty = String(data[i][4]).trim();
      const mrp = String(data[i][5]).trim();

      const searchableText = `${part} ${item} ${desc} ${name}`.toLowerCase();

      // Check every word must match somewhere
      const isMatch = searchWords.every(
        (word) => searchableText.includes(word) || part.slice(-3) === word,
      );

      if (isMatch) {
        results.push({
          rowIndex: i,
          sheetName: name,
          part,
          item,
          desc,
          qty,
          mrp,
        });
      }

      if (results.length >= 20) break;
    }
  }

  if (results.length === 0) {
    return res.status(404).send("No matching stock found");
  }

  res.send(results);
});

stockRouter.post("/update", (req, res) => {
  const { sheetName, rowIndex, qty, mrp } = req.body;

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];

  const qtyCell = `E${rowIndex + 1}`;
  const mrpCell = `F${rowIndex + 1}`;

  if (sheet[qtyCell]) {
    sheet[qtyCell].v = qty;
  } else {
    sheet[qtyCell] = { t: "n", v: Number(qty) };
  }

  if (sheet[mrpCell]) {
    sheet[mrpCell].v = mrp;
  } else {
    sheet[mrpCell] = { t: "n", v: Number(mrp) };
  }

  XLSX.writeFile(workbook, filePath);

  res.send("Updated successfully");
});

module.exports = stockRouter;
