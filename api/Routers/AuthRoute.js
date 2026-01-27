// api/routers/AuthRoute.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const UserData = require("../../Schemas/User_data");
const BusinessData = require("../../Schemas/Business_data");
const staticAuth = require("../middleware/staticAuth");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// SHA-256 hashing
const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");

router.post("/register",async (req, res) => {
  try {
    const { FirstName, LastName, PhoneNumber, password, Email,isAdmin } = req.body;

    if (!FirstName || !PhoneNumber || !password)
      return res.status(400).json({ message: "Required fields missing" });

    const exists = await UserData.findOne({ where: { PhoneNumber } });
    if (exists) return res.status(409).json({ message: "Phone already registered" });

    const user = await UserData.create({
      FirstName: FirstName.trim(),
      LastName: LastName?.trim() || null,
      PhoneNumber: String(PhoneNumber).trim(),
      password: sha256(password),
      isAdmin: !!isAdmin,
      Email : Email.trim()
    });

    res.status(201).json({ message: "Registration successful", user: { id: user.id, FirstName: user.FirstName } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/login",async (req, res) => {
  try {
    const { PhoneNumber, password } = req.body;

    if (!PhoneNumber || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    // Find user
    const user = await UserData.findOne({ where: { PhoneNumber } });
    if (!user) return res.status(401).json({ message: "User not found" });

    // ✅ Plain text password check
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Find business
    const business = await BusinessData.findOne({ where: { user_id: user.id } });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, business_id: business?.id || null },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        FirstName: user.FirstName,
        PhoneNumber: user.PhoneNumber,
        businessId: business?.id || null,
        isAdmin : user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post("/google",async (req, res) => {
  try {
    const { Email, FirstName, LastName, google_id } = req.body;
    if (!Email || !google_id) return res.status(400).json({ message: "Invalid Google data" });

    let user = await UserData.findOne({ where: { Email } });
    if (!user) {
      user = await UserData.create({ Email, FirstName, LastName, google_id, auth_provider: "google" });
    }

    if (!user.google_id) {
      user.google_id = google_id;
      user.auth_provider = "google";
      await user.save();
    }

    const business = await BusinessData.findOne({ where: { user_id: user.id } });
    const token = jwt.sign({ id: user.id, business_id: business?.id || null }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user.id, FirstName: user.FirstName, LastName: user.LastName, Email: user.Email, businessId: business?.id || null } });
  } catch (err) {
    res.status(500).json({ message: "Google login failed" });
  }
});

module.exports = router;
