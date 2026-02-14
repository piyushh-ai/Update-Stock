const stockModel = require("../models/stock.model");

//** /api/bosch/getStock */

async function getStock(req, res) {
  const fullStock = await stockModel.find();
console.log(fullStock);

  res.status(200).json({
    message:"stock fetch successfully",
    fullStock
  });
}

module.exports = {
  getStock,
};
