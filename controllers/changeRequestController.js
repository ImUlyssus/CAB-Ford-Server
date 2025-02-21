const db = require("../config/db");

// Create a new change request
const createRequest = (req, res) => {
  const { category, reason, impact, priority, change_name, change_sites } = req.body;

  const sql = `
    INSERT INTO ChangeRequest (category, reason, impact, priority, change_name, change_sites)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [category, reason, impact, priority, change_name, JSON.stringify(change_sites)], (err, result) => {
    if (err) {
      console.error("❌ Error inserting data:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.status(201).json({ message: "✅ Change Request added successfully!" });
    }
  });
};

// Get all change requests
const getRequests = (req, res) => {
  const sql = "SELECT * FROM ChangeRequest";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching ChangeRequests:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

module.exports = { createRequest, getRequests };
