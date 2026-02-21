const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

const filePath = path.join(__dirname, "../public/Filter-Catalogue-Autolek.pdf");
const pdfPath = filePath;

async function parsePDF() {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdf(buffer);

  const lines = data.text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const results = [];
  let currentBrand = null;

  const brandList = [
    "Maruti Suzuki",
    "Mahindra",
    "Hyundai",
    "TATA",
    "Chevrolet",
    "Toyota",
    "Honda",
    "Renault/Nissan/Skoda",
    "Ford",
    "Volkswagen",
    "Ashok Leyland",
  ];

  for (let i = 0; i < lines.length; i++) {
    // 🔹 Detect Brand
    if (lines[i].toLowerCase().includes("suitable for")) {
      for (const brand of brandList) {
        if (lines[i].toLowerCase().includes(brand.toLowerCase())) {
          currentBrand = brand;
        }
      }
      continue;
    }

    // 🔹 Detect Part Number
    const partMatch = lines[i].match(/AIL Part No\.:\s*(.+)/);
    if (partMatch) {
      const partNumber = partMatch[1].trim();

      let description = "";
      let application = "";
      let mrp = null;
      let stdPacking = null;

      let j = i + 1;

      while (j < lines.length && !lines[j].includes("AIL Part No.")) {
        if (lines[j].startsWith("Description")) {
          description = lines[j].replace("Description :", "").trim();
        } else if (
          !description &&
          !lines[j].startsWith("Application") &&
          !lines[j].includes("MRP") &&
          !lines[j].includes("STD PACKING")
        ) {
          description += " " + lines[j];
        }

        if (lines[j].startsWith("Application")) {
          application = lines[j].replace("Application :", "").trim();

          // handle multi-line application
          let k = j + 1;
          while (
            k < lines.length &&
            !lines[k].includes("MRP") &&
            !lines[k].includes("STD PACKING") &&
            !lines[k].includes("AIL Part No.")
          ) {
            application += " " + lines[k];
            k++;
          }
        }

        if (lines[j].includes("MRP")) {
          const mrpMatch = lines[j].match(/Rs\.\s*(\d+)/);
          if (mrpMatch) mrp = Number(mrpMatch[1]);
        }

        if (lines[j].includes("STD PACKING")) {
          const packMatch = lines[j].match(/STD PACKING\s*:\s*(\d+)/);
          if (packMatch) stdPacking = Number(packMatch[1]);
        }

        if (mrp && stdPacking) break;

        j++;
      }

      results.push({
        brand: currentBrand,
        partNumber,
        filterType: description.split("(")[0].trim(),
        description: description.trim(),
        application: application
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        mrp,
        stdPacking,
      });

      i = j;
    }
  }

  fs.writeFileSync("final_catalogue.json", JSON.stringify(results, null, 2));

  console.log("✅ Catalogue Converted Successfully");
  console.log("Total Products:", results.length);
}

module.exports = parsePDF;
