require("dotenv").config();
const mysql = require("mysql2");

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true, // Wait for a connection if none are available
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queueing for connection requests
});

// Test the database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL Database");
  connection.release(); // Release the connection back to the pool
});

// Table creation query for BusinessCalendar
const createBusinessCalendarTableQuery = `
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

// Table creation query for ChangeRequest
const createChangeRequestTableQuery = `
  CREATE TABLE IF NOT EXISTS ChangeRequest (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('Hardware', 'Application', 'New tech update', 'Password reset') NOT NULL,
    reason ENUM('Fix/Repair', 'New functionality', 'Maintenance', 'Upgrade', 'Tech refresh', 'Yearly change') NOT NULL,
    impact ENUM('Extensive', 'Significant', 'Moderate', 'Minor') NOT NULL,
    priority ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL,
    change_name VARCHAR(255) NOT NULL,
    change_sites JSON NOT NULL,
    common_change BOOLEAN NOT NULL DEFAULT FALSE,
    request_change_date DATE NOT NULL,
    time_of_change INT NOT NULL,
    achieve_2_week_change_request BOOLEAN DEFAULT FALSE,
    ftm_schedule_change DATE DEFAULT NULL,
    aat_schedule_change DATE DEFAULT NULL,
    fsst_schedule_change DATE DEFAULT NULL,
    ftm_it_contact JSON DEFAULT NULL,
    aat_it_contact JSON DEFAULT NULL,
    fsst_it_contact JSON DEFAULT NULL,
    global_team_contact JSON NOT NULL,
    business_team_contact JSON NOT NULL,
    ftm_crq VARCHAR(255) DEFAULT NULL,
    aat_crq VARCHAR(255) DEFAULT NULL,
    fsst_crq VARCHAR(255) DEFAULT NULL,
    common_crq VARCHAR(255) DEFAULT NULL,
    approval BOOLEAN DEFAULT FALSE,
    change_status ENUM(
      'Completed with no issue',
      'Cancel Change Request',
      'FTM change cancel',
      'AAT change cancel',
      'FSST change cancel',
      'Common change cancel'
    ) DEFAULT NULL,
    cancel_change_reason TEXT DEFAULT NULL,
    description TEXT NOT NULL,
    test_plan TEXT NOT NULL,
    rollback_plan TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Table creation query for Users
const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS Users (
    email VARCHAR(40) NOT NULL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    password VARCHAR(255) NOT NULL,
    site VARCHAR(10) NOT NULL,
    accessToken TEXT DEFAULT NULL,
    refreshToken TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

`;

// Execute table creation queries using Promises
const initializeDatabase = async () => {
  try {
    // Create BusinessCalendar table
    await db.promise().query(createBusinessCalendarTableQuery);
    console.log("✅ BusinessCalendar table is ready.");

    // Create ChangeRequest table
    await db.promise().query(createChangeRequestTableQuery);
    console.log("✅ ChangeRequest table is ready.");

    // Create Users table
    await db.promise().query(createUsersTableQuery);
    console.log("✅ Users table is ready.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

// Initialize the database
initializeDatabase();

// Export the database pool
module.exports = db;