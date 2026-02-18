const XLSX = require("xlsx");
const path = require("path");
const rmpCatModel = require("./models/rmpCat.model")

const filePath = path.join(__dirname, "../public/RMP_CAT.xlsx");

async function boschImportExcel() {
  const workbook = XLSX.readFile(filePath);
  for (let sheetName of workbook.SheetNames) {
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);


    const formattedData = sheetData.map((item) => ({
      sno: item["S.No."],
      partNo: item["PartNo."],
      itemDescription: item["Item"],
      application:item["Application"],
      moq: item["MOQ"]
      
    }));
    await rmpCatModel.insertMany(formattedData)
    
    
  }
  
}

module.exports = boschImportExcel;
