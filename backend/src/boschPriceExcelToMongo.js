const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const BoschpriceListModel = require("./models/boschPriceList.model");

const filePath = path.join(
  __dirname,
  "../public/Bosch_Pricelist_PC_feb_2026.xlsx",
);

async function boschPriceImportExcel() {
  try {
    const workbook = XLSX.readFile(filePath);
    const stats = fs.statSync(filePath);
    const modifiedDate = stats.mtime;

    // Sirf first sheet lo
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = sheetData.map((item) => ({
      sno: item['S.No.'],
      materialNo: item["Material No."],
      materialDesc: item["Material Desc."],
      CBF: item["CBF Description"],
      batchCode: item["Batch Code"],
      company: item.Company,
      sheetName: sheetName,
      modifiedDate: modifiedDate,
      lp1: item.LP1,
      lp2: item.LP2,
      lp3: item.LP3,
      mrp: item.MRP,
      pg1: item.PG1,
      pg1Desc: item["PG1 Description"],
      pg2: item.PG2,
      pg2desc: item["PG2 Description"],
      pg3: item.PG3,
      pg3desc: item["PG3 Description"],
      hsn: item["HSN Code"],
      gst: item["GST Rates %"],
      changeLog: item["Change Log"],
      PreGSTMRP: item[" PreGSTMRP"],
      GSTRevisionApplicable: item.GSTRevisionApplicable,
    }));



    const bulkOps = formattedData.map((item) => ({
      updateOne: {
        filter: { materialNo: item.materialNo },
        update: { $set: item },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await BoschpriceListModel.bulkWrite(bulkOps);
    }

    console.log("Bosch Excel Sync Completed ✅");
  } catch (error) {
    console.error("Error importing Excel:", error);
  }
}

module.exports = boschPriceImportExcel;

// {
//     'Material No.': 'F002H280448F8',
//     'Material Desc.': 'Set of brake pads',
//     'CBF Description': '001',
//     'Batch Code': 202602,
//     Company: 'IN20',
//     LP1: 1110.9,
//     LP2: 1199.81,
//     LP3: 2068.64,
//     MRP: 2441,
//     PG1: 'PG001',
//     'PG1 Description': '1. Braking Systems',
//     PG2: 'PG00100001',
//     'PG2 Description': '1.1 Pads',
//     PG3: 'PG0010000100000002',
//     'PG3 Description': '1.1.2 Premium / Special / Sports Pads',
//     'HSN Code': 87083000,
//     'GST Rates %': 18,
//     'Change Log': 'No Change',
//     ' PreGSTMRP': 0,
//     GSTRevisionApplicable: 'Yes'
//   },
