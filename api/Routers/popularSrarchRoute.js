const express = require("express");
const PopularSearch = require("../../Schemas/popularSearches_data");
const router = express.Router();
const Business = require("../../Schemas/Business_data");
const { Op } = require("sequelize");


router.get("/", async (req, res) => {
  try {
    const searches = await PopularSearch.findAll({
      order: [["search_count", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: searches,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/",async (req, res) => {
  try {
    let { keyword } = req.body;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Keyword is required" });
    }

    keyword = keyword.toLowerCase().trim();

    if (keyword.length < 5) {
      return res.status(400).json({
        message: "Keyword must be at least 5 characters long",
      });
    }

    const search = await PopularSearch.findOne({
      where: { keyword },
    });

    if (search) {
      await search.update({
        search_count: search.search_count + 1,
        last_searched_at: new Date(),
      });
    } else {
      await PopularSearch.create({
        keyword,
        search_count: 1,
        last_searched_at: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: "Popular search updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


router.get("/popular", async (req, res) => {
  try {

    const popularKeywords = await PopularSearch.findAll({
      attributes: ["keyword", "search_count"],
      order: [["search_count", "DESC"]],
      raw: true,
    });

    if (!popularKeywords.length) {
      return res.json({ success: true, data: [] });
    }

    const keywords = popularKeywords
      .map(p => p.keyword?.trim())
      .filter(Boolean);

    if (!keywords.length) {
      return res.json({ success: true, data: [] });
    }

    const businesses = await Business.findAll({
      where: {
        [Op.or]: keywords.flatMap(k => ([
          { BusinessName: { [Op.like]: `%${k}%` } }
        ]))
      },
      attributes: [
        "id",
        "BusinessName",
        "BusinessLogo",
        "BusinessAddress"
      ],
      raw: true,
    });


    const uniqueBusinesses = Array.from(
      new Map(businesses.map(b => [b.id, b])).values()
    );

    const result = uniqueBusinesses
      .map(b => {
        const topKeyword = popularKeywords
          .filter(p =>
            p.keyword &&
            (
              b.BusinessName?.toLowerCase().includes(p.keyword.toLowerCase())
            )
          )
          .sort((a, z) => z.search_count - a.search_count)[0];

        return {
          search_count: topKeyword?.search_count || 0,
          business: b,
        };
      })
      .sort((a, z) => z.search_count - a.search_count)
      .slice(0, 5);

    res.json({
      success: true,
      data: result,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});



module.exports = router;
