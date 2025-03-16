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
    global_team_contact, // Store as comma-separated values
    business_team_contact, // Store as comma-separated values
    description = null,
    test_plan = null,
    rollback_plan = null,
    achieve_2_week_change_request,
    approval = "Waiting", // Default to 'Waiting' (per schema)
    change_status,
    cancel_change_reason,
    reschedule_reason, // New field
    lesson_learnt, // New field
    ftm_schedule_change,
    aat_schedule_change,
    fsst_schedule_change,
    ftm_it_contact, // Store as comma-separated values
    aat_it_contact, // Store as comma-separated values
    fsst_it_contact, // Store as comma-separated values
    ftm_crq,
    aat_crq,
    fsst_crq,
    is_someone_updating = '', // New field
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
    (typeof global_team_contact === 'string' && global_team_contact.trim() !== "") ? global_team_contact : null, // FIX: Check if string
    (typeof business_team_contact === 'string' && business_team_contact.trim() !== "") ? business_team_contact : null, // FIX: Check if string
    description || null,
    test_plan || null,
    rollback_plan || null,
    approval,
    change_status || null,
    cancel_change_reason || null,
    reschedule_reason || null,
    lesson_learnt || null,
    ftm_schedule_change ? JSON.stringify(ftm_schedule_change) : null, 
    aat_schedule_change ? JSON.stringify(aat_schedule_change) : null,
    fsst_schedule_change ? JSON.stringify(fsst_schedule_change) : null,
    (typeof ftm_it_contact === 'string' && ftm_it_contact.trim() !== "") ? ftm_it_contact : null, // FIX: Check if string
    (typeof aat_it_contact === 'string' && aat_it_contact.trim() !== "") ? aat_it_contact : null, // FIX: Check if string
    (typeof fsst_it_contact === 'string' && fsst_it_contact.trim() !== "") ? fsst_it_contact : null, // FIX: Check if string
    (typeof ftm_crq === 'string' && ftm_crq.trim() !== "") ? ftm_crq : null, // FIX: Check if string
    (typeof aat_crq === 'string' && aat_crq.trim() !== "") ? aat_crq : null, // FIX: Check if string
    (typeof fsst_crq === 'string' && fsst_crq.trim() !== "") ? fsst_crq : null, // FIX: Check if string
    is_someone_updating || null
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

// Create a new change request
const updateRequest = async (req, res) => {
  const {
    id,
    category,
    reason,
    impact,
    priority,
    change_name,
    change_sites,
    common_change,
    request_change_date,
    global_team_contact, // Store as comma-separated values
    business_team_contact, // Store as comma-separated values
    description = null,
    test_plan = null,
    rollback_plan = null,
    achieve_2_week_change_request,
    approval, // Default to 'Waiting' (per schema)
    change_status,
    cancel_change_reason,
    reschedule_reason, // New field
    lesson_learnt, // New field
    ftm_schedule_change,
    aat_schedule_change,
    fsst_schedule_change,
    ftm_it_contact, // Store as comma-separated values
    aat_it_contact, // Store as comma-separated values
    fsst_it_contact, // Store as comma-separated values
    ftm_crq,
    aat_crq,
    fsst_crq,
    is_someone_updating = '', // New field
    cancel_change_category
  } = req.body;
  // Validate that ID is provided
  if (!id) {
    return res.status(400).json({ error: "❌ Request ID is required for updating." });
  }
  // Validate required fields
  if (!category || !reason || !impact || !priority || !change_name || !change_sites || typeof common_change !== "boolean" || !request_change_date) {
    return res.status(400).json({ error: "❌ All required fields must be filled." });
  }
  const sql = `
    UPDATE ChangeRequest
    SET 
      category = ?, reason = ?, impact = ?, priority = ?, change_name = ?, change_sites = ?, 
      common_change = ?, request_change_date = ?, achieve_2_week_change_request = ?, 
      global_team_contact = ?, business_team_contact = ?, description = ?, test_plan = ?, 
      rollback_plan = ?, approval = ?, change_status = ?, cancel_change_reason = ?, 
      reschedule_reason = ?, lesson_learnt = ?, ftm_schedule_change = ?, aat_schedule_change = ?, 
      fsst_schedule_change = ?, ftm_it_contact = ?, aat_it_contact = ?, fsst_it_contact = ?, 
      ftm_crq = ?, aat_crq = ?, fsst_crq = ?, is_someone_updating = ?,
      cancel_change_category = ?
    WHERE id = ?
  `;

try {
  const [result] = await db.promise().query(sql, [
    category,
    reason,
    impact,
    priority,
    change_name,
    change_sites,
    common_change,
    request_change_date,
    achieve_2_week_change_request,
    (typeof global_team_contact === 'string' && global_team_contact.trim() !== "") ? global_team_contact : null, // FIX: Check if string
    (typeof business_team_contact === 'string' && business_team_contact.trim() !== "") ? business_team_contact : null, // FIX: Check if string
    description || null,
    test_plan || null,
    rollback_plan || null,
    approval,
    change_status || null,
    cancel_change_reason || null,
    reschedule_reason || null,
    lesson_learnt || null,
    ftm_schedule_change ? JSON.stringify(ftm_schedule_change) : null, 
    aat_schedule_change ? JSON.stringify(aat_schedule_change) : null,
    fsst_schedule_change ? JSON.stringify(fsst_schedule_change) : null,
    (typeof ftm_it_contact === 'string' && ftm_it_contact.trim() !== "") ? ftm_it_contact : null, // FIX: Check if string
    (typeof aat_it_contact === 'string' && aat_it_contact.trim() !== "") ? aat_it_contact : null, // FIX: Check if string
    (typeof fsst_it_contact === 'string' && fsst_it_contact.trim() !== "") ? fsst_it_contact : null, // FIX: Check if string
    (typeof ftm_crq === 'string' && ftm_crq.trim() !== "") ? ftm_crq : null, // FIX: Check if string
    (typeof aat_crq === 'string' && aat_crq.trim() !== "") ? aat_crq : null, // FIX: Check if string
    (typeof fsst_crq === 'string' && fsst_crq.trim() !== "") ? fsst_crq : null, // FIX: Check if string
    is_someone_updating || null,
    cancel_change_category,
    id
  ]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "❌ Change Request not found." });
  }

  res.status(200).json({ message: "✅ Change Request successfully updated!" });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

const deleteRequest = async (req, res) => {
  const { id } = req.params;

  if (!id) {
      return res.status(400).json({ error: "❌ Request ID is required for deletion." });
  }

  try {
      const sql = `DELETE FROM ChangeRequest WHERE id = ?`;
      const [result] = await db.promise().query(sql, [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "❌ Change Request not found." });
      }

      res.status(200).json({ message: "✅ Change Request deleted successfully." });
  } catch (err) {
      console.error("❌ Database error:", err);
      res.status(500).json({ error: "Database error", details: err.message });
  }
};
module.exports = { createRequest, getRequests, updateRequest, deleteRequest };