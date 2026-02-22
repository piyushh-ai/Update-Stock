const mongoose = require("mongoose");

const autolekFilterSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    partNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    filterType: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    application: [
      {
        type: String,
        trim: true,
      },
    ],

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    stdPacking: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

// 🔥 Compound Unique Index (Same partNumber same brand me duplicate na aaye)
autolekFilterSchema.index({ brand: 1, partNumber: 1 }, { unique: true });

module.exports = mongoose.model("Autolek_Filter", autolekFilterSchema);
