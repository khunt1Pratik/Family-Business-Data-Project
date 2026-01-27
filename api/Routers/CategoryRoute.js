const express = require("express");
const router = express.Router();
const CategoryData = require("../../Schemas/Category_data"); 


router.get("/",async (req, res) => {
  try {
    const categories = await CategoryData.findAll({
      order: [["categoryid", "DESC"]],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id",async (req, res) => {
  try {
    const category = await CategoryData.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/",async (req, res) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await CategoryData.create({ categoryName });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id",async (req, res) => {
  try {
    const { categoryName } = req.body;

    const category = await CategoryData.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.categoryName = categoryName || category.categoryName;
    await category.save();

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/:id",async (req, res) => {
  try {
    const category = await CategoryData.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
