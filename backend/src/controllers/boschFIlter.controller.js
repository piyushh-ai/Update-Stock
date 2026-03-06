const cvFilterModel = require("../models/boschCVFilter.model");
const BoschFilterModel = require("../models/boschFilter.model");

async function getAllBoschFilters(req, res) {
  try {
    // Pagination
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
            { partNumber: { $regex: word, $options: "i" } },
            { brand: { $regex: word, $options: "i" } },
            { application: { $regex: word, $options: "i" } },
            { filterType: { $regex: word, $options: "i" } },

            // Space-insensitive part number search
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $replaceAll: {
                      input: "$partNumber",
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

    // Fetch Data
    const boschFilters = await BoschFilterModel.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await BoschFilterModel.countDocuments(searchQuery);

    if (boschFilters.length === 0 && total === 0) {
      return res.status(204).json({
        message: "No Bosch filters found",
      });
    }

    res.status(200).json({
      success: true,
      total: total,
      page: page,
      limit: limit,
      boschFilters,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Bosch filters", error: error.message });
  }
}

async function getAllBoschCvFilter(req, res) {
  try {
    // Pagination
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
            {
              PARTNO: { $regex: word, $options: "i" },
            },
            { DESCRIPTION: { $regex: word, $options: "i" } },
            {
              ITEMS: { $regex: word, $options: "i" },
            },

            // Space-insensitive part number search
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $replaceAll: {
                      input: "$PARTNO",
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

    // Fetch Data
    const boschFilters = await cvFilterModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await cvFilterModel.countDocuments(searchQuery);

    if (boschFilters.length === 0 && total === 0) {
      return res.status(204).json({
        message: "No Bosch filters found",
      });
    }

    res.status(200).json({
      success: true,
      total: total,
      page: page,
      limit: limit,
      boschFilters,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Bosch filters", error: error.message });
  }
}

module.exports = {
  getAllBoschFilters,
  getAllBoschCvFilter,
};
