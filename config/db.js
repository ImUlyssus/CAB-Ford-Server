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
    change_name VARCHAR(300) NOT NULL,
    change_sites VARCHAR(30) NOT NULL,
    common_change BOOLEAN NOT NULL DEFAULT FALSE,
    request_change_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    achieve_2_week_change_request BOOLEAN DEFAULT FALSE,
    ftm_schedule_change VARCHAR(210) DEFAULT NULL,
    aat_schedule_change VARCHAR(210) DEFAULT NULL,
    fsst_schedule_change VARCHAR(210) DEFAULT NULL,
    latest_schedule_date DATE DEFAULT NULL,
    ftm_it_contact VARCHAR(101) DEFAULT NULL,
    aat_it_contact VARCHAR(101) DEFAULT NULL,
    fsst_it_contact VARCHAR(101) DEFAULT NULL,
    global_team_contact VARCHAR(152) DEFAULT NULL,
    business_team_contact VARCHAR(152) DEFAULT NULL,
    ftm_crq VARCHAR(95) DEFAULT NULL,
    aat_crq VARCHAR(95) DEFAULT NULL,
    fsst_crq VARCHAR(95) DEFAULT NULL,
    approval ENUM('YES', 'NO', 'Waiting') DEFAULT 'Waiting',
    change_status ENUM(
      '',
      'Completed with no issue',
      'Cancel change request',
      'FTM change cancel',
      'AAT change cancel',
      'FSST change cancel',
      'Common change cancel'
    ) DEFAULT NULL,
    cancel_change_reason VARCHAR(1500) DEFAULT NULL,
    reschedule_reason VARCHAR(1500) DEFAULT NULL,
    lesson_learnt VARCHAR(1500) DEFAULT NULL,
    description VARCHAR(1500) DEFAULT NULL,
    test_plan VARCHAR(1500) DEFAULT NULL,
    rollback_plan VARCHAR(1500) DEFAULT NULL,
    is_someone_updating VARCHAR(50) DEFAULT NULL,
    cancel_change_category ENUM('','Reason 1','Reason 2','Reason 3') DEFAULT NULL,
    lock_timestamp TIMESTAMP NULL
  );
`;

// Table creation query for OldChangeRequest
const createOldChangeRequestTableQuery = `
  CREATE TABLE IF NOT EXISTS OldChangeRequest (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_id INT NOT NULL,
    category ENUM('Hardware', 'Application', 'New tech update', 'Password reset') NOT NULL,
    reason ENUM('Fix/Repair', 'New functionality', 'Maintenance', 'Upgrade', 'Tech refresh', 'Yearly change') NOT NULL,
    impact ENUM('Extensive', 'Significant', 'Moderate', 'Minor') NOT NULL,
    priority ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL,
    change_name VARCHAR(1500) NOT NULL,
    change_sites VARCHAR(30) NOT NULL,
    common_change BOOLEAN NOT NULL DEFAULT FALSE,
    request_change_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    achieve_2_week_change_request BOOLEAN DEFAULT FALSE,
    ftm_schedule_change VARCHAR(210) DEFAULT NULL,
    aat_schedule_change VARCHAR(210) DEFAULT NULL,
    fsst_schedule_change VARCHAR(210) DEFAULT NULL,
    ftm_it_contact VARCHAR(101) DEFAULT NULL,
    aat_it_contact VARCHAR(101) DEFAULT NULL,
    fsst_it_contact VARCHAR(101) DEFAULT NULL,
    global_team_contact VARCHAR(152) DEFAULT NULL,
    business_team_contact VARCHAR(152) DEFAULT NULL,
    ftm_crq VARCHAR(95) DEFAULT NULL,
    aat_crq VARCHAR(95) DEFAULT NULL,
    fsst_crq VARCHAR(95) DEFAULT NULL,
    approval ENUM('YES', 'NO', 'Waiting') DEFAULT 'Waiting',
    change_status ENUM(
      '',
      'Completed with no issue',
      'Cancel change request',
      'FTM change cancel',
      'AAT change cancel',
      'FSST change cancel',
      'Common change cancel'
    ) DEFAULT NULL,
    cancel_change_reason VARCHAR(1500) DEFAULT NULL,
    reschedule_reason VARCHAR(1500) DEFAULT NULL,
    lesson_learnt VARCHAR(1500) DEFAULT NULL,
    description VARCHAR(1500) DEFAULT NULL,
    test_plan VARCHAR(1500) DEFAULT NULL,
    rollback_plan VARCHAR(1500) DEFAULT NULL,
    cancel_change_category ENUM('','Reason 1','Reason 2','Reason 3') DEFAULT NULL,
    who VARCHAR(50) DEFAULT NULL,
    updated_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_field VARCHAR(70) DEFAULT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
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

    // Create ChangeRequest table
    await db.promise().query(createOldChangeRequestTableQuery);
    console.log("✅ OldChangeRequest table is ready.");

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