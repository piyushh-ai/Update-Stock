const BoschpriceListModel = require("../models/boschPriceList.model")
async function getBoschPriceListController(req,res){
    const list = await BoschpriceListModel.find()

    if(!list){
        res.status(204).json({
            message:"Bosch Price List Data not found"
        })
    }

    res.status(200).json({
        message:"Bosch Price List Data fetch successfully",
        list
    })
}


module.exports = getBoschPriceListController