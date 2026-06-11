const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ GET transactions (with filtering)
router.get("/", (req, res) => {
  const { email, type } = req.query;

  let query = `
    SELECT t.*, u.email
    FROM transactions t
    JOIN users u ON t.user_id = u.id
  `;

  let params = [];

  // ✅ filter by email
  if (email) {
    query += " WHERE u.email = ?";
    params.push(email);
  }

  // ✅ filter by type (credit/debit)
  if (type) {
    if (params.length > 0) {
      query += " AND t.type = ?";
    } else {
      query += " WHERE t.type = ?";
    }
    params.push(type);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching transactions");
    }
    res.json(result);
  });
});

module.exports = router;

// ✅ SUMMARY (total credit/debit)
router.get("/summary", (req, res) => {
  db.query(
    `
    SELECT 
      SUM(CASE WHEN type='credit' THEN amount ELSE 0 END) AS total_credit,
      SUM(CASE WHEN type='debit' THEN amount ELSE 0 END) AS total_debit
    FROM transactions
    `,
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error fetching summary");
      }
      res.json(result[0]);
    }
  );
});