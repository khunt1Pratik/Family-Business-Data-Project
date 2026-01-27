// api/middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied! Token missing" });
  }

  const token = header.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error("JWT_SECRET is not configured in environment variables");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.id;
    req.businessId = decoded.business_id || null;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
