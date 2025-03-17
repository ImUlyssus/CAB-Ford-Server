const db = require("../config/db");
const moment = require('moment-timezone');
// Create a new change request
// const createRequest = async (req, res) => {
//   const {
//     category,
//     reason,
//     impact,
//     priority,
//     change_name,
//     change_sites,
//     common_change,
//     request_change_date,
//     global_team_contact, // Store as comma-separated values
//     business_team_contact, // Store as comma-separated values
//     description = null,
//     test_plan = null,
//     rollback_plan = null,
//     achieve_2_week_change_request,
//     approval = "Waiting", // Default to 'Waiting' (per schema)
//     change_status,
//     cancel_change_reason,
//     reschedule_reason, // New field
//     lesson_learnt, // New field
//     ftm_schedule_change,
//     aat_schedule_change,
//     fsst_schedule_change,
//     ftm_it_contact, // Store as comma-separated values
//     aat_it_contact, // Store as comma-separated values
//     fsst_it_contact, // Store as comma-separated values
//     ftm_crq,
//     aat_crq,
//     fsst_crq,
//     is_someone_updating = '', // New field
//   } = req.body;

//   // Validate required fields
//   if (!category || !reason || !impact || !priority || !change_name || !change_sites || typeof common_change !== "boolean" || !request_change_date) {
//     return res.status(400).json({ error: "❌ All required fields must be filled." });
//   }
//   const sql = `
//   INSERT INTO ChangeRequest (
//     category,
//     reason,
//     impact,
//     priority,
//     change_name,
//     change_sites,
//     common_change,
//     request_change_date,
//     achieve_2_week_change_request,
//     global_team_contact,
//     business_team_contact,
//     description,
//     test_plan,
//     rollback_plan,
//     approval,
//     change_status,
//     cancel_change_reason,
//     reschedule_reason,
//     lesson_learnt,
//     ftm_schedule_change,
//     aat_schedule_change,
//     fsst_schedule_change,
//     ftm_it_contact,
//     aat_it_contact,
//     fsst_it_contact,
//     ftm_crq,
//     aat_crq,
//     fsst_crq,
//     is_someone_updating
//   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
// `;

// try {
//   await db.promise().query(sql, [
//     category,
//     reason,
//     impact,
//     priority,
//     change_name,
//     change_sites,
//     common_change,
//     request_change_date,
//     achieve_2_week_change_request,
//     (typeof global_team_contact === 'string' && global_team_contact.trim() !== "") ? global_team_contact : null, // FIX: Check if string
//     (typeof business_team_contact === 'string' && business_team_contact.trim() !== "") ? business_team_contact : null, // FIX: Check if string
//     description || null,
//     test_plan || null,
//     rollback_plan || null,
//     approval,
//     change_status || null,
//     cancel_change_reason || null,
//     reschedule_reason || null,
//     lesson_learnt || null,
//     ftm_schedule_change ? JSON.stringify(ftm_schedule_change) : null, 
//     aat_schedule_change ? JSON.stringify(aat_schedule_change) : null,
//     fsst_schedule_change ? JSON.stringify(fsst_schedule_change) : null,
//     (typeof ftm_it_contact === 'string' && ftm_it_contact.trim() !== "") ? ftm_it_contact : null, // FIX: Check if string
//     (typeof aat_it_contact === 'string' && aat_it_contact.trim() !== "") ? aat_it_contact : null, // FIX: Check if string
//     (typeof fsst_it_contact === 'string' && fsst_it_contact.trim() !== "") ? fsst_it_contact : null, // FIX: Check if string
//     (typeof ftm_crq === 'string' && ftm_crq.trim() !== "") ? ftm_crq : null, // FIX: Check if string
//     (typeof aat_crq === 'string' && aat_crq.trim() !== "") ? aat_crq : null, // FIX: Check if string
//     (typeof fsst_crq === 'string' && fsst_crq.trim() !== "") ? fsst_crq : null, // FIX: Check if string
//     is_someone_updating || null
//   ]);


//     res.status(201).json({ message: "✅ Change Request successfully added!" });
//   } catch (err) {
//     console.error("❌ Database error:", err);
//     res.status(500).json({ error: "Database error", details: err.message });
//   }
// };
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
    approval = "Waiting", // Default to 'Waiting'
    change_status = "Pending", // Default status
    cancel_change_reason = null,
    reschedule_reason = null,
    lesson_learnt = null,
    ftm_schedule_change,
    aat_schedule_change,
    fsst_schedule_change,
    ftm_it_contact, // Store as comma-separated values
    aat_it_contact, // Store as comma-separated values
    fsst_it_contact, // Store as comma-separated values
    ftm_crq,
    aat_crq,
    fsst_crq,
    is_someone_updating = '',
    cancel_change_category = null
  } = req.body;

  // Validate required fields
  if (!category || !reason || !impact || !priority || !change_name || !change_sites || typeof common_change !== "boolean" || !request_change_date) {
    return res.status(400).json({ error: "❌ All required fields must be filled." });
  }

  const sql = `
    INSERT INTO ChangeRequest (
      category, reason, impact, priority, change_name, change_sites, 
      common_change, request_change_date, achieve_2_week_change_request, 
      global_team_contact, business_team_contact, description, test_plan, 
      rollback_plan, approval, change_status, cancel_change_reason, 
      reschedule_reason, lesson_learnt, ftm_schedule_change, aat_schedule_change, 
      fsst_schedule_change, ftm_it_contact, aat_it_contact, fsst_it_contact, 
      ftm_crq, aat_crq, fsst_crq, is_someone_updating, cancel_change_category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      (typeof global_team_contact === 'string' && global_team_contact.trim() !== "") ? global_team_contact : null,
      (typeof business_team_contact === 'string' && business_team_contact.trim() !== "") ? business_team_contact : null,
      description || null,
      test_plan || null,
      rollback_plan || null,
      approval,
      change_status,
      cancel_change_reason || null,
      reschedule_reason || null,
      lesson_learnt || null,
      ftm_schedule_change ? JSON.stringify(ftm_schedule_change) : null,
      aat_schedule_change ? JSON.stringify(aat_schedule_change) : null,
      fsst_schedule_change ? JSON.stringify(fsst_schedule_change) : null,
      (typeof ftm_it_contact === 'string' && ftm_it_contact.trim() !== "") ? ftm_it_contact : null,
      (typeof aat_it_contact === 'string' && aat_it_contact.trim() !== "") ? aat_it_contact : null,
      (typeof fsst_it_contact === 'string' && fsst_it_contact.trim() !== "") ? fsst_it_contact : null,
      (typeof ftm_crq === 'string' && ftm_crq.trim() !== "") ? ftm_crq : null,
      (typeof aat_crq === 'string' && aat_crq.trim() !== "") ? aat_crq : null,
      (typeof fsst_crq === 'string' && fsst_crq.trim() !== "") ? fsst_crq : null,
      is_someone_updating || null,
      cancel_change_category
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

  // Step 2: Log the calculated weeks for debugging
  console.log('Weeks:', weeks);

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
      
      // Log the results for each week
      console.log(`Results for week ${week.start} to ${week.end}:`, results);

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


// update a new change request
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
      console.log(req.query)
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

module.exports = { createRequest, getRequests, updateRequest, deleteRequest, getRequestsForTwoYears, getRequestsForChosenYear, getFilteredData, getWeeklyData };