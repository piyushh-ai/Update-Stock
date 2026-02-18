require("dotenv").config()
const express = require("express");
const cors = require("cors");


app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));



module.exports = app;
