const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ ADD MONEY (credit)
router.post("/add", (req, res) => {
  const { email, amount } = req.body;

  db.query(
    "UPDATE users SET balance = balance + ? WHERE email = ?",
    [amount, email],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating balance");
      }

      db.query(
        "INSERT INTO transactions (amount, type, user_id) SELECT ?, 'credit', id FROM users WHERE email = ?",
        [amount, email],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).send("Error saving transaction");
          }

          res.json({ message: "Money added ✅" });
        }
      );
    }
  );
});

// ✅ SEND MONEY (debit)
router.post("/send", (req, res) => {
  const { email, amount } = req.body;

  // ✅ check balance
  db.query(
    "SELECT balance, id FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error checking balance");
      }

      if (result.length === 0) {
        return res.status(404).send("User not found");
      }

      const user = result[0];

      // ✅ prevent negative balance
      if (user.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance ❌" });
      }

      // ✅ deduct money
      db.query(
        "UPDATE users SET balance = balance - ? WHERE email = ?",
        [amount, email],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).send("Error deducting money");
          }

          // ✅ save transaction
          db.query(
            "INSERT INTO transactions (amount, type, user_id) VALUES (?, 'debit', ?)",
            [amount, user.id],
            (err3) => {
              if (err3) {
                console.error(err3);
                return res.status(500).send("Error saving transaction");
              }

              res.json({ message: "Money sent ✅" });
            }
          );
        }
      );
    }
  );
});

module.exports = router;