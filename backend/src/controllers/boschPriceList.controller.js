const BoschpriceListModel = require("../models/boschPriceList.model");
async function getBoschPriceListController(req, res) {
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
          { materialNo: { $regex: word, $options: "i" } },

          // Space-insensitive part number search
          {
            $expr: {
              $regexMatch: {
                input: {
                  $replaceAll: {
                    input: "$materialNo",
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

  const list = await BoschpriceListModel.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await BoschpriceListModel.countDocuments(searchQuery);

  if (list.length === 0 && total === 0) {
    return res.status(204).json({
      message: "Bosch Price List Data not found",
    });
  }


  res.status(200).json({
    message: "Bosch Price List Data fetch successfully",
    list,
  });
}

module.exports = getBoschPriceListController;
