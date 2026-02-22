const { default: mongoose } = require("mongoose");

const boschFilterSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
    },
    filterType: {
      type: String,
    },
    partNumber: {
      type: String,
    },
    oePartNumbers: [
      {
        type: String,
      },
    ],
    application: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

boschFilterSchema.index({ brand: 1, partNumber: 1 }, { unique: true });

const BoschFilterModel = mongoose.model("BoschFilter", boschFilterSchema);

module.exports = BoschFilterModel;
