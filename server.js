const express = require("express");
const cors = require("cors");

const usersRoute = require("./routes/users");
const walletRoute = require("./routes/wallet");
const transactionsRoute = require("./routes/transactions");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/users", usersRoute);
app.use("/api/wallet", walletRoute);
app.use("/api/transactions", transactionsRoute);

// ✅ Home route
app.get("/", (req, res) => {
  res.send("Mulatap Backend Running ✅");
});

// ✅ Start server
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});

const paymentRoute = require("./routes/payment");

app.use("/api/payment", paymentRoute);