const { default: mongoose } = require("mongoose");

const boschStarterCatSchema = new mongoose.Schema(
  {
    sno: {
      type: String,
      unique: [true, "S.No. must be unique"],
    },
    brandName: {
      type: String,
    },
    segment: {
      type: String,
    },
    vehManufacturer: {
      type: String,
    },
    application: {
      type: String,
    },
    OEPartNo: {
      type: String,
    },
    BoschPartNo: {
      type: String,
    },
    type: {
      type: String,
    },
    armature: {
      type: String,
    },
    ORC: {
      type: String,
    },
    StatorFrame: {
      type: String,
    },
    brushHolder: {
      type: String,
    },
    solenoidSwitch: {
      type: String,
    },
    DEF: {
      type: String,
    },
    bearingDEF: {
      type: String,
    },
    CES: {
      type: String,
    },
    bearingCES: {
      type: String,
    },
    EGT: {
      type: String,
    },
  },
  { timestamps: true },
);

const boschStarterCatModel = mongoose.model(
  "Bosch_Starter_Catalog",
  boschStarterCatSchema,
);

module.exports = boschStarterCatModel;
