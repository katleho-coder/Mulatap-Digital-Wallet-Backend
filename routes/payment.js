const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");

// ✅ GENERATE QR
router.post("/generate", async (req, res) => {
  const { email, amount } = req.body;

  const paymentData = JSON.stringify({
    email,
    amount,
  });

  try {
    const qr = await QRCode.toDataURL(paymentData);
    res.json({ qr });
  } catch (err) {
    res.status(500).send("Error generating QR");
  }
});

module.exports = router;