const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ctu@2026", // ✅ change to YOUR password
  database: "mulatap",
});

db.connect((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Database connected ✅");
  }
});

module.exports = db;