const autolekFilterModel = require("../models/autolekFilter.model");

async function getautolekFilter(req, res) {
  try {
    const filters = await autolekFilterModel.find({});

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
            { description: { $regex: word, $options: "i" } },
            { application: { $regex: word, $options: "i" } },
            { filterType: { $regex: word, $options: "i" } },
            { brand: { $regex: word, $options: "i" } },

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
    const autolekFilter = await autolekFilterModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await autolekFilterModel.countDocuments(searchQuery);

    if (autolekFilter.length === 0 && total === 0) {
      return res.status(204).json({
        message: "No Autolek filters found",
      });
    }

    res.status(200).json({
      success: true,
      total: total,
      page: page,
      limit: limit,
      data: autolekFilter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching autolek filters",
      error: error.message,
    });
  }
}

module.exports = {
  getautolekFilter,
};
