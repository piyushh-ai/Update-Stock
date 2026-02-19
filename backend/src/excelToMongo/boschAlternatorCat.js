const XLSX = require("xlsx");
const path = require("path");
const boschAlternatorCatModel = require("../models/boschAlternatorCat.Model");

const filePath = path.join(
  __dirname,
  "../../public/Bosch_AutoElectric_Cat.xlsx",
);

async function boschAlternatorCat() {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets["alternator"];
  const sheetData = XLSX.utils.sheet_to_json(worksheet);

  const formattedData = sheetData.map((item) => ({
    sno: item["S.No."],
    brandName: item["Brand Name"],
    segment: item["Segment"],
    vehManufacturer: item["Vehicle Manufacture’s Reference No."],
    application: item["Application"],
    OEPartNo: item["OE Part No. Reference"],
    BoschPartNo: item["Bosch Part No. "],
    type: item["Type"],
    rotor: item["Rotor"],
    stator: item["Stator"],
    rectifier: item["Rectifier"],
    regulator: item["Regulator"],
    DEF: item["DEF"],
    bearingDEF: item["Bearing DEF"],
    SREC: item["SREC"],
    bearingSREC: item["Bearing SREC"],
    pulley: item["Pulley"],
    vaccumPump: item["Vacuum Pump"],
  }));

  const bulkOps = formattedData.map((item) => ({
    updateOne: {
      filter: { BoschPartNo: item.BoschPartNo },
      update: { $set: item },
      upsert: true,
    },
  }));

  await boschAlternatorCatModel.bulkWrite(bulkOps);
}

module.exports = boschAlternatorCat;
