const boschAlternatorCatModel = require("../models/boschAlternatorCat.Model");
const boschStarterCatModel = require("../models/boschStarterCat.Model");

async function boschStarterCatController(req, res) {
  try {
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
            { brandName: { $regex: word, $options: "i" } },
            { application: { $regex: word, $options: "i" } },
            { OEPartNo: { $regex: word, $options: "i" } },
            { BoschPartNo: { $regex: word, $options: "i" } },
            { armature: { $regex: word, $options: "i" } },
            { ORC: { $regex: word, $options: "i" } },
            { StatorFrame: { $regex: word, $options: "i" } },
            { brushHolder: { $regex: word, $options: "i" } },
            { solenoidSwitch: { $regex: word, $options: "i" } },
            { EGT: { $regex: word, $options: "i" } },

            // Space-insensitive part number search
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $replaceAll: {
                      input: "$BoschPartNo",
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

    const starterData = await boschStarterCatModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await boschStarterCatModel.countDocuments(searchQuery);

    if (starterData.length === 0) {
      return res.status(404).json({ message: "No starter motor data found" });
    }

    res.status(200).json({
      message: "Bosch starter motor catalog data fetched successfully",
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      starterData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function boschAlternatorCatController(req, res) {
  try {
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
            { brandName: { $regex: word, $options: "i" } },
            { application: { $regex: word, $options: "i" } },
            { OEPartNo: { $regex: word, $options: "i" } },
            { BoschPartNo: { $regex: word, $options: "i" } },
            { rotor: { $regex: word, $options: "i" } },
            { stator: { $regex: word, $options: "i" } },
            { rectifier: { $regex: word, $options: "i" } },
            { regulator: { $regex: word, $options: "i" } },
            { pulley: { $regex: word, $options: "i" } },
            { vaccumPump: { $regex: word, $options: "i" } },

            // Space-insensitive part number search
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $replaceAll: {
                      input: "$BoschPartNo",
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

    const alternatorData = await boschAlternatorCatModel
      .find(searchQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await boschAlternatorCatModel.countDocuments(searchQuery);

    if (alternatorData.length === 0) {
      return res.status(404).json({ message: "No alternator data found" });
    }
    res.status(200).json({
      message: "Bosch alternator catalog data fetched successfully",
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      alternatorData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  boschStarterCatController,
  boschAlternatorCatController,
};
