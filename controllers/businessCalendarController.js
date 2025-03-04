const db = require("../config/db");

const getCalendar = async (req, res) => {
  const currentYear = parseInt(req.params.year, 10);
  if (isNaN(currentYear)) {
    return res.status(400).json({ error: "Invalid year" });
  }

  // Define the three years: previous, current, and next.
  const yearsToCheck = [currentYear - 1, currentYear, currentYear + 1];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const defaultValue = "0".repeat(32); // 32 zeros

  // Function to check for missing months and insert them if needed.
  const checkAndInsertYear = async (year) => {
    try {
      // Query existing months for the given year.
      const [results] = await db.promise().query(
        "SELECT month FROM BusinessCalendar WHERE year = ?",
        [year]
      );

      const existingMonths = results.map((r) => r.month);

      // Identify missing months.
      const missingMonths = months.filter((m) => !existingMonths.includes(m));

      if (missingMonths.length > 0) {
        // Build array of records to insert.
        const records = missingMonths.map((m) => [year, m, defaultValue, defaultValue, defaultValue]);

        // Insert missing months.
        await db.promise().query(
          "INSERT INTO BusinessCalendar (year, month, aat, ftm, fsst) VALUES ?",
          [records]
        );
      }
    } catch (err) {
      throw err; // Propagate the error to the caller.
    }
  };

  try {
    // Process all three years.
    await Promise.all(yearsToCheck.map((year) => checkAndInsertYear(year)));

    // After ensuring the records exist, retrieve data for the three years.
    // The ORDER BY clause uses FIELD to order months in calendar order.
    const [results] = await db.promise().query(
      `SELECT * FROM BusinessCalendar 
       WHERE year IN (?) 
       ORDER BY year, FIELD(month, 'January','February','March','April','May','June','July','August','September','October','November','December')`,
      [yearsToCheck]
    );

    // Success response
    res.json(results);
  } catch (err) {
    console.error("❌ Error in getCalendar:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCalendar };