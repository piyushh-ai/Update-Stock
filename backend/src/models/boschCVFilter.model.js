const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema({
  PARTNO: String,
  ITEMS: String,
  DESCRIPTION: String,
});

const cvFilterModel = mongoose.model("bosch_cv_filter", filterSchema);

module.exports = cvFilterModel;
