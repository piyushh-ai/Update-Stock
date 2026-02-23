const mongoose = require("mongoose");

const priceListSchema = new mongoose.Schema({
  sno: {
    type: String,
  },
  materialNo: {
    type: String,
  },
  materialDesc: {
    type: String,
  },
  CBF: {
    type: String,
  },
  batchCode: {
    type: String,
  },
  company: {
    type: String,
  },
  lp1: {
    type: String,
  },
  lp2: {
    type: String,
  },
  lp3: {
    type: String,
  },
  mrp: {
    type: String,
  },
  pg1: {
    type: String,
  },
  pg1Desc: {
    type: String,
  },
  pg2: {
    type: String,
  },
  pg2desc: {
    type: String,
  },
  pg3: {
    type: String,
  },
  pg3desc: {
    type: String,
  },
  hsn: {
    type: String,
  },
  gst: {
    type: String,
  },
  changeLog: {
    type: String,
  },
  PreGSTMRP: {
    type: String,
  },
  GSTRevisionApplicable: {
    type: String,
  },
});

const BoschpriceListModel = mongoose.model("Bosch_Price_List", priceListSchema);

module.exports = BoschpriceListModel;
