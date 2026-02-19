const { default: mongoose } = require("mongoose");

const boschAECatSchema = new mongoose.Schema(
  {
    sno: {
      type: String,
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
      unique: [true, "Bosch Part number must be unique"],
    },
    type: {
      type: String,
    },
    rotor: {
      type: String,
    },
    stator: {
      type: String,
    },
    rectifier: {
      type: String,
    },
    regulator: {
      type: String,
    },
    DEF: {
      type: String,
    },
    bearingDEF: {
      type: String,
    },
    SREC: {
      type: String,
    },
    bearingSREC: {
      type: String,
    },
    pulley: {
      type: String,
    },
    vaccumPump: {
      type: String,
    },
  },
  { timestamps: true },
);

const boschAlternatorCatModel = mongoose.model(
  "Bosch_Alternator_Catalog",
  boschAECatSchema,
);

module.exports = boschAlternatorCatModel;
