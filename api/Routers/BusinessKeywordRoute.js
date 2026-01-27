const express = require("express");
const router = express.Router();
const BusinessKeyword = require("../../Schemas/BusinessKeyword_data");

// GET all business keywords
router.get("/",async (req, res) => {
  try {
    const data = await BusinessKeyword.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET keywords by business_id
router.get("/business/:id", async (req, res) => {
  const businessId = req.params.id;
  try {
    const data = await BusinessKeyword.findAll({ where: { business_id: businessId } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE a new business keyword
router.post("/",async (req, res) => {
  const { business_id, keyword_id } = req.body;
  try {
    const newRecord = await BusinessKeyword.create({ business_id, keyword_id });
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a business keyword
router.delete("/" ,async (req, res) => {
  const { business_id, keyword_id } = req.body;
  try {
    const deleted = await BusinessKeyword.destroy({ where: { business_id, keyword_id } });
    if (deleted) {
      res.json({ message: "Record deleted successfully" });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE a business keyword (if needed)
router.put("/", async (req, res) => {
  const { business_id, keyword_id, newKeywordId } = req.body;
  try {
    const record = await BusinessKeyword.findOne({ where: { business_id, keyword_id } });
    if (record) {
      record.keyword_id = newKeywordId;
      await record.save();
      res.json({ message: "Record updated", record });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
