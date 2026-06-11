const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ REGISTER USER
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "INSERT INTO users (email, password, balance) VALUES (?, ?, 0)",
    [email, password],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error creating user");
      }
      res.json({ message: "User registered ✅" });
    }
  );
});

// ✅ LOGIN USER
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error logging in");
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid credentials ❌" });
      }

      res.json({ message: "Login successful ✅", user: result[0] });
    }
  );
});

// ✅ GET users (keep this)
router.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

module.exports = router;