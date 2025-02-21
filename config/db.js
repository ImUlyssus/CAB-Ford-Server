require("dotenv").config();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Connect to the database first
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL Database");

  // Now run the query to create the table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ChangeRequest (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
      priority INT NOT NULL CHECK(priority BETWEEN 1 AND 5),  -- Integer field for priority
      isUrgent BOOLEAN DEFAULT FALSE,  -- Boolean field for urgency
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("ChangeRequest table ensured.");
    }
  });
});

module.exports = db;
