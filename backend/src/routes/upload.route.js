// routes/upload.route.js

const express = require("express");
const multer = require("multer");
const { uploadExcel } = require("../controllers/upload.controller");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// router.post(
//   "/upload-excel",
//   upload.fields([
//     { name: "bosch", maxCount: 1 },
//     { name: "company", maxCount: 1 },
//   ]),
//   uploadExcel,
// );

module.exports = router;
