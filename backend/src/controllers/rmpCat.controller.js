const rmpCatModel = require("../models/rmpCat.model");

async function rmpCatController(req, res) {
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
            { partNo: { $regex: word, $options: "i" } },
            { itemDescription: { $regex: word, $options: "i" } },
            { application: { $regex: word, $options: "i" } },

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
    const rmpCat = await rmpCatModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await rmpCatModel.countDocuments(searchQuery);

    if (rmpCat.length === 0 && total === 0) {
      return res.status(204).json({
        message: "No RMP Catalogue items found",
      });
    }

    res.status(200).json({
      message: "RMP Catalogue fetched successfully",
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      rmpCat,
    });
  } catch (error) {
    console.error("Error in rmpCatController:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  rmpCatController,
};
