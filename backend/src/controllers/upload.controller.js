// controllers/upload.controller.js

const { importExcel } = require("../services/excel.service");
const boschStockModel = require("../models/boschStock.model");
const companyStockModel = require("../models/companyStock.model");
const fs = require("fs");

exports.uploadExcel = async (req, res) => {
  try {
    const boschFile = req.files?.bosch?.[0];
    const companyFile = req.files?.company?.[0];

    if (!boschFile && !companyFile) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if (boschFile) {
      await importExcel(boschFile.path, boschStockModel);
      fs.unlinkSync(boschFile.path); // 🧹 cleanup
    }

    if (companyFile) {
      await importExcel(companyFile.path, companyStockModel);
      fs.unlinkSync(companyFile.path);
    }

    res.json({ message: "Stock updated successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
