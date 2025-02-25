const db = require("../config/db");

const createBusinessCalendarTable = () => {
    console.log("🚀 Attempting to create BusinessCalendar table...");
    const sql = `
      CREATE TABLE IF NOT EXISTS BusinessCalendar (
        id INT AUTO_INCREMENT PRIMARY KEY,
        year INT NOT NULL,
        month VARCHAR(20) NOT NULL,
        aat VARCHAR(32) NOT NULL,
        ftm VARCHAR(32) NOT NULL,
        fsst VARCHAR(32) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    db.query(sql, (err, result) => {
      if (err) {
        console.error("❌ Error creating BusinessCalendar table:", err);
      } else {
        console.log("✅ BusinessCalendar table is ready.");
      }
    });
  };

  module.exports = { createBusinessCalendarTable };

