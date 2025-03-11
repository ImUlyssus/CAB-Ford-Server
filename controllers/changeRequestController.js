const db = require("../config/db");

// Create a new change request
const createRequest = async (req, res) => {
  const {
    category,
    reason,
    impact,
    priority,
    change_name,
    change_sites,
    common_change,
    request_change_date,
    global_team_contact = "", // Store as comma-separated values
    business_team_contact = "", // Store as comma-separated values
    description = null,
    test_plan = null,
    rollback_plan = null,
    achieve_2_week_change_request = false,
    approval = "Waiting", // Default to 'Waiting' (per schema)
    change_status = null,
    cancel_change_reason = null,
    reschedule_reason = null, // New field
    lesson_learnt = null, // New field
    ftm_schedule_change = null,
    aat_schedule_change = null,
    fsst_schedule_change = null,
    ftm_it_contact = "", // Store as comma-separated values
    aat_it_contact = "", // Store as comma-separated values
    fsst_it_contact = "", // Store as comma-separated values
    ftm_crq = null,
    aat_crq = null,
    fsst_crq = null,
    is_someone_updating = null, // New field
  } = req.body;

  // Validate required fields
  if (!category || !reason || !impact || !priority || !change_name || !change_sites || typeof common_change !== "boolean" || !request_change_date) {
    return res.status(400).json({ error: "❌ All required fields must be filled." });
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
    achieve_2_week_change_request,
    global_team_contact,
    business_team_contact,
    description,
    test_plan,
    rollback_plan,
    approval,
    change_status,
    cancel_change_reason,
    reschedule_reason,
    lesson_learnt,
    ftm_schedule_change,
    aat_schedule_change,
    fsst_schedule_change,
    ftm_it_contact,
    aat_it_contact,
    fsst_it_contact,
    ftm_crq,
    aat_crq,
    fsst_crq,
    is_someone_updating
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

try {
  await db.promise().query(sql, [
    category,
    reason,
    impact,
    priority,
    change_name,
    change_sites,
    common_change,
    request_change_date,
    achieve_2_week_change_request,
    global_team_contact,
    business_team_contact,
    description,
    test_plan,
    rollback_plan,
    approval,
    change_status,
    cancel_change_reason,
    reschedule_reason,
    lesson_learnt,
    JSON.stringify(ftm_schedule_change), // Convert arrays or objects to JSON
    JSON.stringify(aat_schedule_change),
    JSON.stringify(fsst_schedule_change),
    ftm_it_contact,
    aat_it_contact,
    fsst_it_contact,
    ftm_crq,
    aat_crq,
    fsst_crq,
    is_someone_updating,
  ]);


    res.status(201).json({ message: "✅ Change Request successfully added!" });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Get all change requests
const getRequests = async (req, res) => {
  const sql = "SELECT * FROM ChangeRequest";

  try {
    // Execute the query using mysql2's promise-based API
    const [results] = await db.promise().query(sql);

    // Success response
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching ChangeRequests:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

module.exports = { createRequest, getRequests };