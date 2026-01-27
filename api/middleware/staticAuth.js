// // middleware/staticAuth.js
// const STATIC_TOKEN ="my_secret_static_token";

// const staticAuth = (req, res, next) => {
//   const token = req.headers["x-api-key"]; 

//   if (!token) {
//     return res.status(401).json({ message: "API key missing" });
//   }

//   if (token !== STATIC_TOKEN) {
//     return res.status(403).json({ message: "Forbidden: Invalid API key" });
//   }

//   next();
// };

// module.exports = staticAuth;


// middleware/staticAuth.js

const CryptoJS = require("crypto-js");


const SECRET_KEY = process.env.STATIC_AUTH_SECRET_KEY || "12345678901234567890123456789012";
const IV = SECRET_KEY.substring(0, 16);
const EXPECTED_TOKEN = process.env.STATIC_AUTH_TOKEN || "195";

const staticAuth = (req, res, next) => {
  const encrypted = req.headers["x-api-key"];
  if (!encrypted) return res.status(401).json({ message: "API key missing" });

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
      iv: CryptoJS.enc.Utf8.parse(IV)
    });

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (decrypted !== EXPECTED_TOKEN) {
      return res.status(403).json({ message: "Forbidden: Invalid API key" });
    }

    next();
  } catch (err) {
    console.error("Static auth error:", err.message);
    return res.status(400).json({ message: "Bad token format" });
  }
};

module.exports = staticAuth;

