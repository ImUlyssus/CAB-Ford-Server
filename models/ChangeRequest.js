const db = require("../config/db");

const createChangeRequestTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS ChangeRequest (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('Hardware', 'Application', 'New tech update', 'Password reset') NOT NULL,
  reason ENUM('Fix/Repair', 'New functionality', 'Maintenance', 'Upgrade', 'Tech refresh', 'Yearly change') NOT NULL,
  impact ENUM('Extensive', 'Significant', 'Moderate', 'Minor') NOT NULL,
  priority ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL,
  change_name VARCHAR(255) NOT NULL,
  change_sites JSON NOT NULL,  -- To store multiple site selections
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

  `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Error creating ChangeRequest table:", err);
    } else {
      console.log("✅ ChangeRequest table is ready.");
    }
  });
};

// Run table creation
createChangeRequestTable();

module.exports = db;
