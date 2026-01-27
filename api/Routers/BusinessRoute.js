const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Business = require("../../Schemas/Business_data");
const UserData = require("../../Schemas/User_data");
const Keyword = require("../../Schemas/keyword_data");
const CategoryData = require("../../Schemas/Category_data")


const sequelize = require("../database");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


router.get("/", async (req, res) => {
  try {
    const data = await Business.findAll({
      include: [
        {
          model: UserData,
          attributes: ["id", "FirstName", "PhoneNumber", "LastName", "MiddleName"],
        },
        {
          model: CategoryData,
          attributes: ["categoryid", "categoryName"],
        }, {
          model: Keyword,
          as: "keywords",
          through: { attributes: [] },
        },
      ],
      order: [["id", "DESC"]],
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id",async (req, res) => {
  try {
    const record = await Business.findByPk(req.params.id, {
      include: [
        {
          model: UserData,
          attributes: ["id", "FirstName", "PhoneNumber", "LastName", "MiddleName"],
        },
        {
          model: CategoryData,
          attributes: ["categoryid", "categoryName"],
        }, {
          model: Keyword,
          as: "keywords",
          through: { attributes: [] },
        },
      ],
    });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post(
  "/",
  upload.fields([
    { name: "BusinessCard", maxCount: 1 },
    { name: "BusinessLogo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { user_id, categoryid } = req.body;

      if (!user_id || !categoryid) {
        return res.status(400).json({
          message: "user_id and categoryid are required",
        });
      }

      // 🔹 One business per user
      const existingBusiness = await Business.findOne({
        where: { user_id },
      });

      if (existingBusiness) {
        return res.status(400).json({
          message: "This user already has a business",
        });
      }

      // 🔹 Check category
      const categoryExists = await CategoryData.findByPk(categoryid);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }

      // 🔹 Prepare data
      const data = {
        ...req.body,
        BusinessCard: req.files?.BusinessCard?.[0]?.filename || null,
        BusinessLogo: req.files?.BusinessLogo?.[0]?.filename || null,
      };

      // 🔹 Create business
      const newBusiness = await Business.create(data);

      // 🔥 LINK BUSINESS → USER (THIS WAS MISSING)
      await UserData.update(
        { business_id: newBusiness.id },
        { where: { id: user_id } }
      );

      // 🔹 Return clean response
      res.status(201).json({
        business_id: newBusiness.id,
        business_name: newBusiness.BusinessName,
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);



router.put(
  "/:id",
  upload.fields([
    { name: "BusinessCard", maxCount: 1 },
    { name: "BusinessLogo", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const data = { ...req.body };

      if (req.files?.BusinessCard) {
        data.BusinessCard = req.files.BusinessCard[0].filename;
      }

      if (req.files?.BusinessLogo) {
        data.BusinessLogo = req.files.BusinessLogo[0].filename;
      }

      const updated = await Business.update(data, {
        where: { id: req.params.id },
      });

      res.json({ message: "Record updated", updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


router.delete("/:id", async (req, res) => {
  try {
    await Business.destroy({ where: { id: req.params.id } });
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
