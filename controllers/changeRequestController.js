const db = require("../config/db");

// Create a new change request
const createRequest = (req, res) => {
  const {
    category,
    reason,
    impact,
    priority,
    change_name,
    change_sites,
    common_change,
    request_change_date,
    global_team_contact = [], // Default value
    business_team_contact = [], // Default value
    description = "None", // Default value
    test_plan = "None", // Default value
    rollback_plan = "None", // Default value
    time_of_change = 0, // Default value
    achieve_2_week_change_request = false, // Default value
    approval = false, // Default value
    change_status = null, // Default value
    cancel_change_reason = null, // Default value
    ftm_schedule_change = null, // Default value
    aat_schedule_change = null, // Default value
    fsst_schedule_change = null, // Default value
    ftm_it_contact = null, // Default value
    aat_it_contact = null, // Default value
    fsst_it_contact = null, // Default value
    ftm_crq = null, // Default value
    aat_crq = null, // Default value
    fsst_crq = null, // Default value
    common_crq = null // Default value
  } = req.body;

  // Validate incoming data
  if (!category || !reason || !impact || !priority || !change_name || !change_sites || typeof common_change !== 'boolean' || !request_change_date) {
    return res.status(400).json({ error: "❌ All fields are required, including request_change_date." });
  }

  const sql = `
    INSERT INTO ChangeRequest (
      category,
      reason,
      impact,
      priority,
      change_name,
      change_sites,
      common_change,
      request_change_date,
      time_of_change,
      achieve_2_week_change_request,
      global_team_contact,
      business_team_contact,
      description,
      test_plan,
      rollback_plan,
      approval,
      change_status,
      cancel_change_reason,
      ftm_schedule_change,
      aat_schedule_change,
      fsst_schedule_change,
      ftm_it_contact,
      aat_it_contact,
      fsst_it_contact,
      ftm_crq,
      aat_crq,
      fsst_crq,
      common_crq
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    category,
    reason,
    impact,
    priority,
    change_name,
    JSON.stringify(change_sites),
    common_change,
    request_change_date,
    time_of_change,
    achieve_2_week_change_request,
    JSON.stringify(global_team_contact), // Ensure this is a JSON string
    JSON.stringify(business_team_contact), // Ensure this is a JSON string
    description,
    test_plan,
    rollback_plan,
    approval,
    change_status,
    cancel_change_reason,
    ftm_schedule_change,
    aat_schedule_change,
    fsst_schedule_change,
    JSON.stringify(ftm_it_contact),
    JSON.stringify(aat_it_contact),
    JSON.stringify(fsst_it_contact),
    ftm_crq,
    aat_crq,
    fsst_crq,
    common_crq
  ], (err, result) => {
    if (err) {
      console.error("❌ Error inserting data:", err);
      res.status(500).json({ error: "Database error", details: err.message });
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
