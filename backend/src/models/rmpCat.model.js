const { default: mongoose } = require("mongoose");

const rmpCatSchema = new mongoose.Schema({
  sno: {
    type: String,
  },
  partNo: {
    type: String,
    trim: true
  },
  itemDescription: {
    type: String,
  },
  application: {
    type: String,
  },
  moq: {
    type: String,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const rmpCatModel = mongoose.model("RMP_STOCK", rmpCatSchema);

module.exports = rmpCatModel;
