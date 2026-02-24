const companyStockModel = require("../models/companyStock.model");

/**
 * Controller to fetch all company stock data
 */
async function getAllCompanyStockController(req, res) {
  try {
    const fullStock = await companyStockModel.find().lean();

    if (fullStock.length === 0) {
      return res.status(204).json({ message: "No company stock data found" });
    }

    res.status(200).json({ data: fullStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Controller to fetch all company sheet data
 */
async function getCompanyStockSheetsController(req, res) {
  try {
    const sheets = await companyStockModel.distinct("sheetName");

    if (sheets.length === 0) {
      return res.status(204).json({ message: "No sheet data found" });
    }

    // Search
    const rawSearch = req.query.search || "";
    const search = rawSearch.trim();

    let searchQuery = {};

    if (search) {
      const words = search.split(/\s+/); // split input into words

      searchQuery = {
        $and: words.map((word) => ({
          $or: [
            // Normal field search
            { sheetName: { $regex: word, $options: "i" } },

            // Space-insensitive part number search
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $replaceAll: {
                      input: "$sheetName",
                      find: " ",
                      replacement: "",
                    },
                  },
                  regex: word.replace(/\s+/g, ""),
                  options: "i",
                },
              },
            },
          ],
        })),
      };
    }

    const sheetData = await companyStockModel.distinct(
      "sheetName",
      searchQuery,
    );

    if (sheetData.length === 0) {
      return res
        .status(204)
        .json({ message: "No stock data found for search query" });
    }

    res
      .status(200)
      .json({ message: "Successfully retrieved sheet data", sheetData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Controller to fetch all company stock data for a specific sheet
 */
async function getCompanyStockBySheetNameController(req, res) {
  try {
    const { sheetName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Search
    const rawSearch = req.query.search || "";
    const search = rawSearch.trim();

    let searchQuery = {};

    if (search) {
      const words = search.split(/\s+/); // split input into words

      searchQuery = {
        $and: words.map((word) => ({
          $or: [
            // Normal field search
            { partno: { $regex: word, $options: "i" } },
            { description: { $regex: word, $options: "i" } },
            { itemName: { $regex: word, $options: "i" } },
            { sheetName: { $regex: word, $options: "i" } },

            // Space-insensitive part number search
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $replaceAll: {
                      input: "$partno",
                      find: " ",
                      replacement: "",
                    },
                  },
                  regex: word.replace(/\s+/g, ""),
                  options: "i",
                },
              },
            },
          ],
        })),
      };
    }

    const stockBySheet = await companyStockModel
      .find({ sheetName: sheetName, ...searchQuery })
      .skip(skip)
      .lean()
      .limit(limit);

    const total = await companyStockModel.countDocuments({
      sheetName: sheetName,
      ...searchQuery,
    });

    if (stockBySheet.length === 0) {
      return res.status(204).json({
        message: `No stock data found for sheet: ${sheetName}`,
      });
    }

    res.status(200).json({
      message: `Successfully retrieved stock data for sheet: ${sheetName}`,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      stockBySheet,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllCompanyStockController,
  getCompanyStockSheetsController,
  getCompanyStockBySheetNameController,
};
