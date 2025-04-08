const db = require("../config/db");
const moment = require('moment-timezone');
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
    aat_requestor = null,
    ftm_requestor = null,
    fsst_requestor = null,
    aat_test_plan = null,
    ftm_test_plan = null,
    fsst_test_plan = null,
    rollback_plan = null,
    achieve_2_week_change_request,
    approval = "Waiting", // Default to 'Waiting'
    change_status = "_", // Default status
    cancel_change_reason = null,
    reschedule_reason = null,
    lesson_learnt = null,
    ftm_schedule_change,
    aat_schedule_change,
    fsst_schedule_change,
    latest_schedule_date = null,
    ftm_it_contact, // Store as comma-separated values
    aat_it_contact, // Store as comma-separated values
    fsst_it_contact, // Store as comma-separated values
    ftm_crq,
    aat_crq,
    fsst_crq,
    is_someone_updating = '',
    cancel_change_category = null,
    lock_timestamp = null,
    remarks = ""
  } = req.body;

  // Validate required fields
  if (!category || !reason || !impact || !priority || !change_name || !change_sites || typeof common_change !== "boolean" || !request_change_date) {
    return res.status(400).json({ error: "❌ All required fields must be filled." });
  }

  const sql = `
    INSERT INTO ChangeRequest (
      category, reason, impact, priority, change_name, change_sites, 
      common_change, request_change_date, achieve_2_week_change_request, 
      global_team_contact, business_team_contact, description, aat_requestor, ftm_requestor, fsst_requestor, aat_test_plan, 
      ftm_test_plan, fsst_test_plan, rollback_plan, approval, change_status, cancel_change_reason, 
      reschedule_reason, lesson_learnt, ftm_schedule_change, aat_schedule_change, 
      fsst_schedule_change, latest_schedule_date, ftm_it_contact, aat_it_contact, fsst_it_contact, 
      ftm_crq, aat_crq, fsst_crq, is_someone_updating, cancel_change_category, lock_timestamp, remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // Handle empty objects for global_team_contact and business_team_contact
  const sanitizedGlobalTeamContact =
    global_team_contact && Object.keys(global_team_contact).length > 0 ? global_team_contact : null;
  const sanitizedBusinessTeamContact =
    business_team_contact && Object.keys(business_team_contact).length > 0 ? business_team_contact : null;
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
      sanitizedGlobalTeamContact,
      sanitizedBusinessTeamContact,
      description || null,
      aat_requestor || null,
      ftm_requestor || null,
      fsst_requestor || null,
      aat_test_plan || null,
      ftm_test_plan || null,
      fsst_test_plan || null,
      rollback_plan || null,
      approval,
      change_status,
      cancel_change_reason || null,
      reschedule_reason || null,
      lesson_learnt || null,
      ftm_schedule_change || null,
      aat_schedule_change || null,
      fsst_schedule_change || null,
      latest_schedule_date,
      (typeof ftm_it_contact === 'string' && ftm_it_contact.trim() !== "") ? ftm_it_contact : null,
      (typeof aat_it_contact === 'string' && aat_it_contact.trim() !== "") ? aat_it_contact : null,
      (typeof fsst_it_contact === 'string' && fsst_it_contact.trim() !== "") ? fsst_it_contact : null,
      (typeof ftm_crq === 'string' && ftm_crq.trim() !== "") ? ftm_crq : null,
      (typeof aat_crq === 'string' && aat_crq.trim() !== "") ? aat_crq : null,
      (typeof fsst_crq === 'string' && fsst_crq.trim() !== "") ? fsst_crq : null,
      is_someone_updating || null,
      cancel_change_category,
      lock_timestamp,
      remarks
    ]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: "❌ Failed to create Change Request." });
    }

    res.status(201).json({ message: "✅ Change Request successfully created!" });
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
const adjustToTimezone = (dateString, timezone) => {
  return moment(dateString).tz(timezone).format('YYYY-MM-DD HH:mm:ss'); // Format as needed
};

const getRequestsForTwoYears = async (req, res) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const sql = `
    SELECT * 
    FROM ChangeRequest 
    WHERE YEAR(request_change_date) IN (?, ?)
    ORDER BY request_change_date ASC
  `;

  try {
    const [results] = await db.promise().query(sql, [currentYear, previousYear]);

    // Convert each date to GMT+7 and format it
    const adjustedResults = results.map((request) => {
      request.request_change_date = adjustToTimezone(request.request_change_date, 'Asia/Bangkok');
      return request;
    });

    res.json(adjustedResults);
  } catch (err) {
    console.error("❌ Error fetching ChangeRequests for two years:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
const getRequestsForChosenYear = async (req, res) => {
  const { year } = req.params;
  const previousYear = parseInt(year) - 1; // Calculate the previous year

  // SQL query to filter requests for the chosen year and the previous year, sorted by request_change_date
  const sql = `
    SELECT * 
    FROM ChangeRequest 
    WHERE YEAR(request_change_date) IN (?, ?)
    ORDER BY request_change_date ASC
  `;

  try {
    // Execute the query with the chosen year and previous year parameters
    const [results] = await db.promise().query(sql, [year, previousYear]);

    // Convert each date to GMT+7 and format it
    const adjustedResults = results.map((request) => {
      request.request_change_date = adjustToTimezone(request.request_change_date, 'Asia/Bangkok');
      return request;
    });

    // Send the adjusted results to frontend
    res.json(adjustedResults);
  } catch (err) {
    console.error("❌ Error fetching ChangeRequests for chosen year and previous year:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
const getWeeklyData = async (req, res) => {
  const weeks = [];
  const today = new Date();

  // Step 1: Find the last Friday and calculate the previous 4 weeks
  let lastFriday = new Date(today);

  // Get last Friday
  lastFriday.setDate(today.getDate() - (today.getDay() + 1) % 7); // Move to the previous Friday

  // Calculate 4 weeks, starting from the Saturday of each week
  for (let i = 0; i < 4; i++) {
    // Calculate the Saturday of the current week (start of the week)
    const saturdayOfWeek = new Date(lastFriday);
    saturdayOfWeek.setDate(lastFriday.getDate() - 6); // Go back 6 days to get Saturday

    // Calculate the Friday of the current week (end of the week)
    const fridayOfWeek = new Date(lastFriday);

    // Deduct one day from both Saturday and Friday to match the correct dates
    saturdayOfWeek.setDate(saturdayOfWeek.getDate() - 1);  // Subtract 1 day from Saturday
    fridayOfWeek.setDate(fridayOfWeek.getDate() - 1);  // Subtract 1 day from Friday

    // Set the start date (Saturday) to 00:00:00
    saturdayOfWeek.setHours(0, 0, 0, 0); // Set time to 00:00:00.000 (start of the day)

    // Set the end date (Friday) to 23:59:59
    fridayOfWeek.setHours(23, 59, 59, 999); // Set time to 23:59:59.999 (end of the day)

    // Push the week start (Saturday) and end (Friday) to the weeks array
    weeks.push({
      start: adjustToTimezone(saturdayOfWeek.toISOString(), 'Asia/Bangkok'),
      end: adjustToTimezone(fridayOfWeek.toISOString(), 'Asia/Bangkok'),
    });

    // Move to the previous week's Friday
    lastFriday.setDate(lastFriday.getDate() - 7);
  }

  // Step 3: Fetch data for each of the 4 weeks
  try {
    const adjustedResults = [];

    // Loop through each week and fetch the ChangeRequest data
    for (let week of weeks) {
      const sql = `
        SELECT * 
        FROM ChangeRequest 
        WHERE request_change_date BETWEEN ? AND ?
        ORDER BY request_change_date ASC
      `;

      // Query the database for the week range
      const [results] = await db.promise().query(sql, [week.start, week.end]);


      // Adjust the date for each result and store them
      const weekData = results.map(request => {
        request.request_change_date = adjustToTimezone(request.request_change_date, 'Asia/Bangkok');
        return request;
      });

      // Push the data for the current week
      adjustedResults.push({
        week: week,
        data: weekData
      });
    }

    // Step 4: Send the final response to the frontend
    res.json(adjustedResults);
  } catch (err) {
    console.error("❌ Error fetching ChangeRequests:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
const updateRequest = async (req, res) => {
  const {
    email,
    id,
    category,
    reason,
    impact,
    priority,
    change_name,
    change_sites,
    common_change,
    request_change_date,
    global_team_contact,
    business_team_contact,
    description = null,
    test_plan = null,
    rollback_plan = null,
    achieve_2_week_change_request,
    approval,
    change_status,
    cancel_change_reason,
    reschedule_reason,
    lesson_learnt,
    ftm_schedule_change,
    aat_schedule_change,
    fsst_schedule_change,
    latest_schedule_date,
    ftm_it_contact,
    aat_it_contact,
    fsst_it_contact,
    ftm_crq,
    aat_crq,
    fsst_crq,
    is_someone_updating,
    cancel_change_category
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "❌ Request ID is required for updating." });
  }


  try {
    // Step 1: Fetch current record from ChangeRequest
    const [rows] = await db.promise().query("SELECT * FROM ChangeRequest WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "❌ Change Request not found." });
    }
    const oldData = rows[0];
    if (email !== oldData.is_someone_updating) {
      return res.status(400).json({ error: "❌ CDSID is not matching to update." });
    }
    // Step 2: Determine which fields have changed
    let updatedFields = [];
    const fields = [
      'category', 'reason', 'impact', 'priority', 'change_name', 'change_sites', 'common_change', 'request_change_date',
      'achieve_2_week_change_request', 'ftm_schedule_change', 'aat_schedule_change', 'fsst_schedule_change', 'latest_schedule_date',
      'ftm_it_contact', 'aat_it_contact', 'fsst_it_contact', 'global_team_contact', 'business_team_contact',
      'ftm_crq', 'aat_crq', 'fsst_crq', 'approval', 'change_status', 'cancel_change_reason', 'reschedule_reason',
      'lesson_learnt', 'description', 'test_plan', 'rollback_plan', 'cancel_change_category'
    ];

    fields.forEach((field, index) => {
      if (req.body[field] !== undefined && req.body[field] !== oldData[field]) {
        updatedFields.push(index + 1); // Store as space-separated numbers
      }
    });

    // Step 3: Insert old data into OldChangeRequest
    const migrationSQL = `INSERT INTO OldChangeRequest (
      original_id, category, reason, impact, priority, change_name, change_sites, common_change, request_change_date,
      achieve_2_week_change_request, ftm_schedule_change, aat_schedule_change, fsst_schedule_change, latest_schedule_date,
      ftm_it_contact, aat_it_contact, fsst_it_contact, global_team_contact, business_team_contact,
      ftm_crq, aat_crq, fsst_crq, approval, change_status, cancel_change_reason, reschedule_reason,
      lesson_learnt, description, test_plan, rollback_plan, cancel_change_category,
      who, updated_date, updated_field, is_deleted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, FALSE);`;
    // const updatedDate = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
    await db.promise().query(migrationSQL, [
      id, oldData.category, oldData.reason, oldData.impact, oldData.priority, oldData.change_name,
      oldData.change_sites, oldData.common_change, oldData.request_change_date,
      oldData.achieve_2_week_change_request, oldData.ftm_schedule_change, oldData.aat_schedule_change, oldData.fsst_schedule_change,
      oldData.latest_schedule_date, oldData.ftm_it_contact, oldData.aat_it_contact, oldData.fsst_it_contact, oldData.global_team_contact,
      oldData.business_team_contact, oldData.ftm_crq, oldData.aat_crq, oldData.fsst_crq, oldData.approval,
      oldData.change_status, oldData.cancel_change_reason, oldData.reschedule_reason, oldData.lesson_learnt,
      oldData.description, oldData.test_plan, oldData.rollback_plan, oldData.cancel_change_category,
      is_someone_updating, updatedFields.join(' ')
    ]);

    // Step 4: Update ChangeRequest
    const updateSQL = `UPDATE ChangeRequest SET 
      category = ?, reason = ?, impact = ?, priority = ?, change_name = ?, change_sites = ?,
      common_change = ?, achieve_2_week_change_request = ?,
      global_team_contact = ?, business_team_contact = ?, description = ?, test_plan = ?,
      rollback_plan = ?, approval = ?, change_status = ?, cancel_change_reason = ?,
      reschedule_reason = ?, lesson_learnt = ?, ftm_schedule_change = ?, aat_schedule_change = ?,
      fsst_schedule_change = ?, latest_schedule_date = ?, ftm_it_contact = ?, aat_it_contact = ?, fsst_it_contact = ?,
      ftm_crq = ?, aat_crq = ?, fsst_crq = ?, cancel_change_category = ?, is_someone_updating = ? WHERE id = ?;`;

    // Handle empty objects for global_team_contact and business_team_contact
    const sanitizedGlobalTeamContact =
      global_team_contact && Object.keys(global_team_contact).length > 0 ? global_team_contact : null;
    const sanitizedBusinessTeamContact =
      business_team_contact && Object.keys(business_team_contact).length > 0 ? business_team_contact : null;
    // Replace undefined or null values with appropriate defaults
    const updateValues = [
      category || null,
      reason || null,
      impact || null,
      priority || null,
      change_name || null,
      change_sites || null,
      common_change || null,
      // request_change_date || null,
      achieve_2_week_change_request || null,
      sanitizedGlobalTeamContact,
      sanitizedBusinessTeamContact,
      description || null,
      test_plan || null,
      rollback_plan || null,
      approval || null,
      change_status || null,
      cancel_change_reason || null,
      reschedule_reason || null,
      lesson_learnt || null,
      ftm_schedule_change ? JSON.stringify(ftm_schedule_change) : null,
      aat_schedule_change ? JSON.stringify(aat_schedule_change) : null,
      fsst_schedule_change ? JSON.stringify(fsst_schedule_change) : null,
      latest_schedule_date,
      ftm_it_contact || null,
      aat_it_contact || null,
      fsst_it_contact || null,
      ftm_crq || null,
      aat_crq || null,
      fsst_crq || null,
      cancel_change_category || null,
      '',
      id
    ];

    const [result] = await db.promise().query(updateSQL, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "❌ Change Request not found." });
    }

    res.status(200).json({ message: "✅ Change Request successfully updated!" });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

const updateCheck = async (req, res) => {
  const { email, id } = req.body;

  if (!email || !id) {
    return res.status(400).json({ message: "❌ Email and ID are required." });
  }

  try {
    // Step 1: Retrieve the current request from the database
    const [rows] = await db.promise().query("SELECT * FROM ChangeRequest WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "❌ Change Request not found." });
    }

    const request = rows[0];

    // Step 2: Check if the request is locked and if the lock has expired
    if (request.is_someone_updating && request.is_someone_updating !== '') {
      const lockTimestamp = new Date(request.lock_timestamp);
      const currentTime = new Date();
      const timeDifference = (currentTime - lockTimestamp) / 1000 / 60; // Difference in minutes

      if (timeDifference > 31) { // If lock is older than 30 minutes
        // Reset lock
        await db.promise().query("UPDATE ChangeRequest SET is_someone_updating = ?, lock_timestamp = ? WHERE id = ?", [null, null, id]);

        // Allow user to update
        return res.status(200).json({
          message: "✅ 30 mins lock expired. You can now update the request.",
          canUpdate: true
        });
      }

      // Instead of returning 409, return 200 with a force update flag
      return res.status(200).json({
        message: `❌ This request is currently being updated by ${request.is_someone_updating}`,
        isSomeoneUpdating: request.is_someone_updating,
        canForceUpdate: true // 🆕 Add this flag
      });
    }

    // Step 3: If 'is_someone_updating' is null or empty, update it with the email and set timestamp
    await db.promise().query("UPDATE ChangeRequest SET is_someone_updating = ?, lock_timestamp = ? WHERE id = ?", [email, new Date(), id]);

    // Step 4: Respond with 'true' since the update is successful
    return res.status(200).json({
      message: "✅ You can update the request now.",
      canUpdate: true
    });

  } catch (error) {
    console.error("❌ Error in check-to-update:", error);
    return res.status(500).json({ message: "❌ Internal server error." });
  }
};
const getCustomDateData = async (req, res) => {
  try {
    const { start, end } = req.query; // Get date range from request

    if (!start || !end) {
      return res.status(400).json({ error: "Start and end dates are required." });
    }

    const sql = `
          SELECT * 
          FROM ChangeRequest 
          WHERE request_change_date BETWEEN ? AND ?
          ORDER BY request_change_date ASC
      `;

    const [results] = await db.promise().query(sql, [start, end]);

    res.json(results); // Send data back to frontend
  } catch (err) {
    console.error("❌ Error fetching custom date data:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

const forceUpdateRequest = async (req, res) => {
  try {
    const { id, email } = req.body;

    if (!id || !email) {
      return res.status(400).json({ message: "❌ Email and ID are required." });
    }

    // Step 1: Check if the request exists
    const [rows] = await db.promise().query(
      "SELECT * FROM ChangeRequest WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "❌ Change Request not found." });
    }

    // Step 2: Force update the lock
    await db.promise().query(
      "UPDATE ChangeRequest SET is_someone_updating = ?, lock_timestamp = ? WHERE id = ?",
      [email, new Date(), id]
    );

    // Step 3: Respond with success
    return res.status(200).json({
      message: "✅ Force update successful. You can now edit the request.",
      canUpdate: true
    });

  } catch (error) {
    console.error("❌ Error in force update:", error);
    return res.status(500).json({ message: "❌ Internal server error." });
  }
};
const goBackUpdate = async (req, res) => {
  try {
    const { id, email } = req.body;

    if (!id) {
      return res.status(400).json({ message: "❌ ID is required." });
    }

    // Step 1: Check if the request exists
    const [rows] = await db.promise().query(
      "SELECT * FROM ChangeRequest WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "❌ Change Request not found." });
    }

    // Step 2: Force update the lock
    await db.promise().query(
      "UPDATE ChangeRequest SET is_someone_updating = ? WHERE id = ?",
      [email, id]
    );

    // Step 3: Respond with success
    return res.status(200).json({
      message: "✅ Force update successful. You can now edit the request.",
      canUpdate: true
    });

  } catch (error) {
    console.error("❌ Error in force update:", error);
    return res.status(500).json({ message: "❌ Internal server error." });
  }
};
const deleteRequest = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body; // Access the email from the body

  if (!id || !email) {
    return res.status(400).json({ error: "❌ Request ID and Email are required for deletion." });
  }

  try {
    // Step 1: Insert old data into OldChangeRequest table with 'who' as the email
    const [rows] = await db.promise().query("SELECT * FROM ChangeRequest WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "❌ Change Request not found." });
    }
    const oldData = rows[0];

    const migrationSQL = `INSERT INTO OldChangeRequest (
          original_id, category, reason, impact, priority, change_name, change_sites, common_change, request_change_date,
          achieve_2_week_change_request, ftm_schedule_change, aat_schedule_change, fsst_schedule_change,
          ftm_it_contact, aat_it_contact, fsst_it_contact, global_team_contact, business_team_contact,
          ftm_crq, aat_crq, fsst_crq, approval, change_status, cancel_change_reason, reschedule_reason,
          lesson_learnt, description, test_plan, rollback_plan, cancel_change_category,
          who, updated_date, updated_field, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, TRUE);`;

    await db.promise().query(migrationSQL, [
      id, oldData.category, oldData.reason, oldData.impact, oldData.priority, oldData.change_name,
      oldData.change_sites, oldData.common_change, oldData.request_change_date,
      oldData.achieve_2_week_change_request, oldData.ftm_schedule_change, oldData.aat_schedule_change, oldData.fsst_schedule_change,
      oldData.ftm_it_contact, oldData.aat_it_contact, oldData.fsst_it_contact, oldData.global_team_contact,
      oldData.business_team_contact, oldData.ftm_crq, oldData.aat_crq, oldData.fsst_crq, oldData.approval,
      oldData.change_status, oldData.cancel_change_reason, oldData.reschedule_reason, oldData.lesson_learnt,
      oldData.description, oldData.test_plan, oldData.rollback_plan, oldData.cancel_change_category,
      email, '', // Store the email in the 'who' column and update date
    ]);

    // Step 2: Delete the request from ChangeRequest table
    const sql = "DELETE FROM ChangeRequest WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "❌ Change Request not found." });
    }

    res.status(200).json({ message: "✅ Change Request deleted successfully." });

  } catch (err) {
    console.error("❌ Error deleting Change Request:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Function to get start and end dates for a selected week
const getWeekRange = (year, month) => {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDate = new Date(firstDay);

  if (startDate.getDay() !== 6) {
    startDate.setDate(startDate.getDate() - (startDate.getDay() + 1) % 7);
  }

  while (startDate <= lastDay) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    if (startDate.getMonth() === month || endDate.getMonth() === month) {
      weeks.push({
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0]
      });
    }
    startDate.setDate(startDate.getDate() + 7);
  }
  return weeks;
};
const getFilteredData = async (req, res) => {
  try {
    const { year, quarter, month, week } = req.query;
    let query = "SELECT * FROM change_requests WHERE YEAR(request_change_date) = ?";
    let params = [year];

    if (quarter !== "All") {
      const quarterMonths = { 1: [1, 2, 3], 2: [4, 5, 6], 3: [7, 8, 9], 4: [10, 11, 12] };
      query += " AND MONTH(request_change_date) IN (?)";
      params.push(quarterMonths[quarter]);
    }

    if (month !== "All") {
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
      query += " AND MONTH(request_change_date) = ?";
      params.push(monthNumber);
    }

    if (week !== "All" && month !== "All") {
      const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
      const weeks = getWeekRange(year, monthIndex);
      const [startStr, endStr] = week.split(" - ");

      const startDate = weeks.find(w => w.start.includes(startStr)).start;
      const endDate = weeks.find(w => w.end.includes(endStr)).end;
      query += " AND request_change_date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    const [results] = db.query(query, params);
    res.json(results);
  } catch (err) {
    console.error("Error filtering change requests:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getVersionHistory = async (req, res) => {
  try {
    const { start, end } = req.query; // Get date range from request

    if (!start || !end) {
      return res.status(400).json({ error: "Start and end dates are required." });
    }

    const sql = `
      SELECT * 
      FROM OldChangeRequest 
      WHERE updated_date BETWEEN ? AND ?
      ORDER BY updated_date ASC
    `;

    const [results] = await db.promise().query(sql, [start, end]);

    // Convert updated_date to Bangkok timezone for each result
    const formattedResults = results.map((row) => {
      return {
        ...row,
        updated_date: moment(row.updated_date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss'),
      };
    });

    res.json(formattedResults); // Send formatted data back to frontend
  } catch (err) {
    console.error("❌ Error fetching custom date data:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
const getVHRequestDetails = async (req, res) => {
  const { id } = req.params;
  const { updated_date, is_deleted } = req.query; // Get updated_date from query params

  if (!id || !updated_date) {
    return res.status(400).json({ error: "❌ Request ID and updated_date are required." });
  }
  try {
    if (is_deleted !== '0') {
      // If is_deleted is true, return the row with the latest updated_date from OldChangeRequest
      const sqlLatestOldRequest = `
        SELECT * FROM OldChangeRequest 
        WHERE original_id = ? 
        ORDER BY updated_date DESC 
        LIMIT 1
      `;
      const [latestOldResult] = await db.promise().query(sqlLatestOldRequest, [id]);

      if (latestOldResult.length > 0) {
        return res.json({
          ...latestOldResult[0],
          updated_date: moment(latestOldResult[0].updated_date)
            .tz("Asia/Bangkok")
            .format("YYYY-MM-DD HH:mm:ss"),
        });
      } else {
        return res.status(404).json({ error: "❌ No records found in OldChangeRequest." });
      }
    } else {
      // Step 1: Query all records from OldChangeRequest with the given original_id
      const sqlOldRequest = `
    SELECT * FROM OldChangeRequest 
    WHERE original_id = ? 
    ORDER BY updated_date DESC
  `;
      const [oldResults] = await db.promise().query(sqlOldRequest, [id]);

      if (oldResults.length === 0) {
        // If no old records exist, return data from ChangeRequest
        const sqlChangeRequest = "SELECT * FROM ChangeRequest WHERE id = ?";
        const [changeResults] = await db.promise().query(sqlChangeRequest, [id]);

        if (changeResults.length > 0) {
          return res.json(changeResults[0]);
        } else {
          return res.status(404).json({ error: "❌ No data found for the given ID." });
        }
      }

      // Step 2: Check if updated_date is the latest date in OldChangeRequest
      const latestOldRecord = oldResults[0]; // Since results are ordered DESC, first one is the latest
      if (moment(updated_date).isSameOrAfter(moment(latestOldRecord.updated_date))) {
        // If target updated_date is the latest, return data from ChangeRequest
        const sqlChangeRequest = "SELECT * FROM ChangeRequest WHERE id = ?";
        const [changeResults] = await db.promise().query(sqlChangeRequest, [id]);

        if (changeResults.length > 0) {
          return res.json(changeResults[0]);
        } else {
          return res.status(404).json({ error: "❌ No data found for the given ID." });
        }
      }

      // Step 3: Find the closest (but less than) updated_date from OldChangeRequest
      const closestRecord = oldResults.find(record =>
        moment(record.updated_date).isAfter(moment(updated_date))
      );

      if (!closestRecord) {
        return res.status(404).json({ error: "❌ No older records found before the given updated_date." });
      }

      // Convert updated_date to Bangkok timezone
      const responseRecord = {
        ...closestRecord,
        updated_date: moment(closestRecord.updated_date)
          .tz("Asia/Bangkok")
          .format("YYYY-MM-DD HH:mm:ss"),
      };

      return res.json(responseRecord);
    }
  } catch (err) {
    console.error("❌ Error fetching version history details:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

const getThisWeekData = async (req, res) => {
  try {
    // Get current date in UTC and normalize it
    const today = moment().tz("UTC").startOf("day");

    // Find the latest Saturday (before or equal to today)
    let latestSaturday = today.clone().day(-1); // Last Saturday
    if (today.day() === 6) latestSaturday = today; // If today is Saturday, use today

    // Find the next Friday (after or equal to today)
    let nextFriday = today.clone().day(12); // Next Friday
    if (today.day() === 5) nextFriday = today; // If today is Friday, use today

    // Convert to YYYY-MM-DD format for SQL query
    const latestSaturdayStr = latestSaturday.format("YYYY-MM-DD");
    const nextFridayStr = nextFriday.format("YYYY-MM-DD");
    // const latestSaturdayStr = '2025-02-22';
    // const nextFridayStr = '2025-02-28';
    console.log("Latest Saturday:", latestSaturdayStr);
    console.log("Next Friday:", nextFridayStr);

    // Query the database
    const sqlQuery = `SELECT * FROM ChangeRequest WHERE latest_schedule_date >= ?`;
    const [results] = await db.promise().query(sqlQuery, [latestSaturdayStr]);

    // If no results found, return empty arrays
    if (!results || results.length === 0) {
      return res.json({ approved: [], toApprove: [] });
    }

    // Separate results into "approved" and "toApprove" arrays
    const approved = [];
    const toApprove = [];

    results.forEach(record => {
      if (moment(record.latest_schedule_date).isBefore(moment(nextFridayStr))) {
        approved.push(record);
      } else {
        toApprove.push(record);
      }
    });

    // Send response
    res.json({ approved, toApprove });
  } catch (error) {
    console.error("❌ Error fetching weekly data:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = { createRequest, getRequests, updateRequest, deleteRequest, getRequestsForTwoYears, getRequestsForChosenYear, getFilteredData, getWeeklyData, updateCheck, forceUpdateRequest, getCustomDateData, getVersionHistory, getVHRequestDetails, goBackUpdate, getThisWeekData };