// api/routers/UserRoute.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const UserData = require("../../Schemas/User_data");

// Hash function
const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");

router.get("/", async (req, res) => {
  try {
    const users = await UserData.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await UserData.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const { FirstName, LastName, MiddleName ,VillageName,CityName,Email,PhoneNumber, password, isAdmin } = req.body;

    if (!FirstName || !PhoneNumber || !password)
      return res.status(400).json({ message: "FirstName, PhoneNumber, and password are required" });

    const exists = await UserData.findOne({ where: { PhoneNumber } });
    if (exists) return res.status(409).json({ message: "Phone number already registered" });

    const newUser = await UserData.create({
      FirstName: FirstName.trim(),
      LastName: LastName?.trim() || null,
      MiddleName : MiddleName.trim(),
      VillageName : VillageName.trim(),
      CityName : CityName.trim(),
      Email : Email.trim(),
      PhoneNumber: String(PhoneNumber).trim(),
      password: sha256(password),
      isAdmin: !!isAdmin,
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const user = await UserData.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updateData = {};
    const fields = ["FirstName", "MiddleName", "LastName", "VillageName", "CityName", "Email", "PhoneNumber"];

    for (const key of fields) {
      if (req.body[key]?.trim()) {
        updateData[key] = req.body[key].trim();
      }
    }

    // 🔴 Check duplicate Email
    if (updateData.Email) {
      const emailExists = await UserData.findOne({
        where: {
          Email: updateData.Email,
          id: { [require("sequelize").Op.ne]: userId }, // exclude current user
        },
      });

      if (emailExists) {
        return res.status(409).json({ message: "Email is already registered" });
      }
    }

    // 🔴 Check duplicate Phone
    if (updateData.PhoneNumber) {
      const phoneExists = await UserData.findOne({
        where: {
          PhoneNumber: updateData.PhoneNumber,
          id: { [require("sequelize").Op.ne]: userId },
        },
      });

      if (phoneExists) {
        return res.status(409).json({ message: "Phone number is already registered" });
      }
    }

    // 🔐 Update password if provided
    if (req.body.password && req.body.password.trim() !== "") {
      updateData.password = sha256(req.body.password.trim());
    }

    await user.update(updateData);

    res.json({ message: "Profile updated successfully", user });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});



router.put("/admin/:id",async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { isAdmin } = req.body;

    if (typeof isAdmin !== "boolean")
      return res.status(400).json({ message: "isAdmin must be boolean" });

    const [updatedRows] = await UserData.update({ isAdmin }, { where: { id: userId } });
    if (updatedRows === 0) return res.status(404).json({ message: "User not found" });

    const updatedUser = await UserData.findByPk(userId);
    res.json({ message: "Admin status updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const deletedRows = await UserData.destroy({ where: { id: userId } });

    if (deletedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
