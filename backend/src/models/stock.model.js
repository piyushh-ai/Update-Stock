const { default: mongoose } = require("mongoose");

const stockSchema = new mongoose.Schema({
  sno: {
    type: Number,
  },
  partNo: {
    type: String,
  },
  description: {
    type: String,
  },

  itemName: {
    type: String,
  },
  quantity: Number,
 mrp: {
  type: Number,
  default: 0
},
  companyName: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const stockModel = mongoose.model("boschStock", stockSchema);

module.exports = stockModel;
