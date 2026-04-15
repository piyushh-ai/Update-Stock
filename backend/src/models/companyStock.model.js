const { default: mongoose } = require("mongoose");

const companyStockSchema = new mongoose.Schema(
  {
    sno: {
      type: String,
    },
    partno: {
      type: String,
    unique: [true, "Part number must be unique"],
    },
    itemName: {
      type: String,
    },
    description: {
      type: String,
    },
    quantity: {
      type: String,
    },
    mrp: {
      type: String,
    },
    sheetName: {
      type: String,
    },
     modifiedDate: {
      type: String,
    },
  },
  { timestamps: true },
);


const companyStockModel = mongoose.model("Company_Stock", companyStockSchema);

module.exports = companyStockModel;