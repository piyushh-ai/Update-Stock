const { default: mongoose } = require("mongoose");

const boschStockSchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

const boschStockModel = mongoose.model("boschStock", boschStockSchema);

module.exports = boschStockModel;
