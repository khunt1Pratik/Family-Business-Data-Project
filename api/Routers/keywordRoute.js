const express = require("express");
const router = express.Router();
const Keyword = require("../../Schemas/keyword_data");


router.get("/",async (req, res) => {
  try {
    const keywords = await Keyword.findAll();
    res.json(keywords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const keyword = await Keyword.findByPk(req.params.id);
    if (!keyword) {
      return res.status(404).json({ message: "Keyword not found" });
    }
    res.json(keyword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/",async (req, res) => {
  try {
    const { keyword_name  } = req.body;
    if (!keyword_name ) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const newKeyword = await Keyword.create({ keyword_name  });
    res.status(201).json(newKeyword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id",async (req, res) => {
  try {
    const { keyword_name } = req.body;
    const existingKeyword = await Keyword.findByPk(req.params.id);

    if (!existingKeyword) {
      return res.status(404).json({ message: "Keyword not found" });
    }

    existingKeyword.keyword_name = keyword_name || existingKeyword.keyword_name;
    await existingKeyword.save();
    res.json(existingKeyword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const keyword = await Keyword.findByPk(req.params.id);
    if (!keyword) {
      return res.status(404).json({ message: "Keyword not found" });
    }

    await keyword.destroy();
    res.json({ message: "Keyword deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
