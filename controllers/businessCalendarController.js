const db = require("../config/db");

const getCalendar = (req, res) => {
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
  
    // For each year, check for missing months and insert them if needed.
    const checkAndInsertYear = (year) => {
      return new Promise((resolve, reject) => {
        // Query existing months for the given year.
        db.query(
          "SELECT month FROM BusinessCalendar WHERE year = ?",
          [year],
          (err, results) => {
            if (err) return reject(err);
            const existingMonths = results.map((r) => r.month);
            // Identify missing months.
            const missingMonths = months.filter((m) => !existingMonths.includes(m));
            if (missingMonths.length === 0) {
              return resolve();
            }
            // Build array of records to insert.
            const records = missingMonths.map((m) => [year, m, defaultValue, defaultValue, defaultValue]);
            db.query(
              "INSERT INTO BusinessCalendar (year, month, aat, ftm, fsst) VALUES ?",
              [records],
              (err, result) => {
                if (err) return reject(err);
                resolve();
              }
            );
          }
        );
      });
    };
  
    // Process all three years.
    Promise.all(yearsToCheck.map((year) => checkAndInsertYear(year)))
      .then(() => {
        // After ensuring the records exist, retrieve data for the three years.
        // The ORDER BY clause uses FIELD to order months in calendar order.
        db.query(
          `SELECT * FROM BusinessCalendar 
           WHERE year IN (?) 
           ORDER BY year, FIELD(month, 'January','February','March','April','May','June','July','August','September','October','November','December')`,
          [yearsToCheck],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json(results);
          }
        );
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  };

  module.exports = { getCalendar };
