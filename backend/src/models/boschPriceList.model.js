const mongoose = require("mongoose");

const priceListSchema = new mongoose.Schema(
  {
    sno: {
      type: String,
      default: "",
    },
    materialNo: {
      type: String,
      default: "",
    },
    materialDesc: {
      type: String,
      default: "",
    },
    CBF: {
      type: String,
      default: "",
    },
    batchCode: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    lp1: {
      type: String,
      default: "0",
    },
    lp2: {
      type: String,
      default: "0",
    },
    lp3: {
      type: String,
      default: "0",
    },
    mrp: {
      type: String,
      default: "0",
    },
    pg1: {
      type: String,
      default: "",
    },
    pg1Desc: {
      type: String,
      default: "",
    },
    pg2: {
      type: String,
      default: "",
    },
    pg2desc: {
      type: String,
      default: "",
    },
    pg3: {
      type: String,
      default: "",
    },
    pg3desc: {
      type: String,
      default: "",
    },
    hsn: {
      type: String,
      default: "",
    },
    gst: {
      type: String,
      default: "0",
    },
    changeLog: {
      type: String,
      default: "",
    },
    PreGSTMRP: {
      type: String,
      default: "0",
    },
    GSTRevisionApplicable: {
      type: String,
      default: "No",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt automatically
  }
);

const BoschpriceListModel = mongoose.model(
  "Bosch_Price_List",
  priceListSchema
);

module.exports = BoschpriceListModel;