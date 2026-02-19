const boschStockModel = require("../models/boschStock.model");

async function boschStockController(req, res) {
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

    // Fetch Data
    const boschStock = await boschStockModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await boschStockModel.countDocuments(searchQuery);

    if (boschStock.length === 0 && total === 0) {
      return res.status(404).json({
        message: "No Bosch Stock items found",
      });
    }

    res.status(200).json({
      message: "Bosch Stock fetched successfully",
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      boschStock,
    });
  } catch (error) {
    console.error("Error in boschStockController:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  boschStockController,
};
