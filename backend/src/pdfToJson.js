const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

const pdfPath = path.join(__dirname, "../public/Filter-Catalogue-Autolek.pdf");

async function parsePDF() {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdf(buffer);

  const lines = data.text
    .split("\n")
    .map(l => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const results = [];

  let currentBrand = null;
  let i = 0;

  while (i < lines.length) {

    // 🔹 Strict brand detection
    if (
      lines[i].includes("AIR FILTER") &&
      lines[i].includes("FUEL FILTER") &&
      lines[i + 1] &&
      lines[i + 1].startsWith("Suitable for")
    ) {
      currentBrand = lines[i + 1]
        .replace("Suitable for", "")
        .trim();
      i += 2;
      continue;
    }

    // 🔹 Product detection
    if (currentBrand && lines[i].startsWith("AIL Part No.:")) {

      const partNumber = lines[i]
        .replace("AIL Part No.:", "")
        .trim();

      let description = null;
      let application = "";
      let mrp = null;
      let stdPacking = null;

      i++;

      while (i < lines.length) {

        if (lines[i].startsWith("AIL Part No.:")) break;
        if (lines[i].startsWith("Suitable for")) break;

        if (lines[i].startsWith("Description")) {
          description = lines[i]
            .replace("Description :", "")
            .trim();
        }

        if (lines[i].startsWith("Application")) {
          application = lines[i]
            .replace("Application :", "")
            .trim();
        }

        if (lines[i].startsWith("MRP")) {
          mrp = parseFloat(lines[i].replace(/[^0-9.]/g, ""));
        }

        if (lines[i].startsWith("STD PACKING")) {
          stdPacking = parseInt(lines[i].replace(/[^0-9]/g, ""));
        }

        i++;
      }

      // ✅ Only push COMPLETE product
      if (description && mrp && stdPacking) {

        const filterTypeMatch = description.match(
          /(AIR FILTER|OIL FILTER|FUEL FILTER|CABIN FILTER|DIESEL FILTER|CNG FILTER|OIL\/FUEL KIT)/i
        );

        results.push({
          brand: currentBrand,
          partNumber,
          filterType: filterTypeMatch
            ? filterTypeMatch[1].toUpperCase()
            : null,
          description,
          application: application
            .split(",")
            .map(a => a.trim())
            .filter(Boolean),
          mrp,
          stdPacking
        });
      }

      continue;
    }

    i++;
  }

  fs.writeFileSync(
    "autolek_full_catalogue_clean.json",
    JSON.stringify(results, null, 2)
  );

  console.log("✅ Clean Extraction Complete");
  console.log("Total Valid Products:", results.length);
}

module.exports = parsePDF;