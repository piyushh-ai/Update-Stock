const express = require("express")
const { getStock } = require("../controllers/boschStock.controller")

const stockRouter = express.Router()


stockRouter.get("/getStock", getStock)


module.exports = stockRouter