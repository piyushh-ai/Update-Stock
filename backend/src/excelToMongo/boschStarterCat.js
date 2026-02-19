const XLSX = require("xlsx");
const path = require("path");
const boschAlternatorCatModel = require("../models/boschAlternatorCat.Model");
const boschStarterCatModel = require("../models/boschStarterCat.Model");

const filePath = path.join(
  __dirname,
  "../../public/Bosch_AutoElectric_Cat.xlsx",
);

async function boschStarterCat() {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets["starter"];
  const sheetData = XLSX.utils.sheet_to_json(worksheet);

  const formattedData = sheetData.map((item) => ({
    sno: item["S.No."],
    brandName: item["Brand Name"],
    segment: item["Segment"],
    vehManufacturer: item["Vehicle Manufacture’s Reference No."],
    application: item["Application"],
    OEPartNo: item["OE Part No. Reference"],
    BoschPartNo: item["Bosch Part No."],
    type: item["Type"],
    armature: item["Armature"],
    ORC: item["ORC"],
    StatorFrame: item["Stator Frame/ Pole Housing"],
    brushHolder: item["Brush Holder"],
    solenoidSwitch: item["Solenoid Switch"],
    DEF: item["DEF"],
    bearingDEF: item["Bearing DEF"],
    CES: item["CEC"],
    bearingCES: item["Bearing CEC"],
    EGT: item["EGT"],
  }));

  const unique = new Set(formattedData.map((i) => i.BoschPartNo));
  console.log("Total rows:", formattedData.length);
  console.log("Unique BoschPartNo:", unique.size);

  const bulkOps = formattedData.map((item) => ({
    updateOne: {
      filter: { sno: item.sno },
      update: { $set: item },
      upsert: true,
    },
  }));

  await boschStarterCatModel.bulkWrite(bulkOps);
}

module.exports = boschStarterCat;
