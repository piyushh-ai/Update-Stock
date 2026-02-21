const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");


const filePath = path.join(__dirname, "../public/PC_Filters_compressed.pdf");
const pdfPath = filePath;

async function parsePDF() {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdf(dataBuffer);

  const lines = data.text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const results = [];
  let currentBrand = null;

  for (let i = 0; i < lines.length; i++) {

    // Detect Brand
    const brandMatch = lines[i].match(/^Suitable for (.+)$/);
    if (brandMatch) {
      currentBrand = brandMatch[1].trim();
      continue;
    }

    // Detect Filter Type
    if (
      lines[i] === "Air Filter" ||
      lines[i] === "Oil Filter" ||
      lines[i] === "Fuel Filter" ||
      lines[i] === "Cabin Filter"
    ) {

      const filterType = lines[i];

      const boschPartNumber = lines[i + 1] || "";

      let oePartNumber = [];
      let compatibleModels = [];

      // Find OE PN
      const oeMatch = lines[i + 2]?.match(/OE PN\s*:\s*(.+)/);
      if (oeMatch) {
        oePartNumber = oeMatch[1]
          .split(",")
          .map(p => p.trim());
      }

      // Collect models (next line)
      let modelLine = lines[i + 3] || "";

      // Sometimes models span multiple lines
      let j = i + 4;
      while (
        j < lines.length &&
        !lines[j].includes("Filter") &&
        !lines[j].startsWith("Suitable for") &&
        !lines[j].includes("OE PN")
      ) {
        modelLine += " " + lines[j];
        j++;
      }

      compatibleModels = modelLine
        .split(",")
        .map(m => m.trim())
        .filter(Boolean);

      results.push({
        brand: currentBrand,
        filterType,
        boschPartNumber,
        oePartNumber,
        compatibleModels
      });

      i = j - 1;
    }
  }

  fs.writeFileSync(
    "bosch_filters.json",
    JSON.stringify(results, null, 2)
  );

  console.log("✅ JSON file created successfully");
}

module.exports = parsePDF;