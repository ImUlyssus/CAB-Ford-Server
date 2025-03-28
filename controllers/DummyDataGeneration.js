const db = require("../config/db"); // Import your database connection
const { faker } = require("@faker-js/faker");
const moment = require('moment-timezone');
// Define ENUM values for randomization
const categories = ["Hardware", "Application", "New tech update", "Password reset"];
const reasons = ["Fix/Repair", "New functionality", "Maintenance", "Upgrade", "Tech refresh", "Yearly change"];
const impacts = ["Extensive", "Significant", "Moderate", "Minor"];
const priorities = ["Critical", "High", "Medium", "Low"];
const sites = ["aat", "ftm", "fsst"];
const approval = ["YES", "NO"];
const changeStatuses = [
    "",
    "Completed with no issue",
    "Cancel change request",
    "FTM change cancel",
    "AAT change cancel",
    "FSST change cancel",
    "Common change cancel"
];
const cancelReasons = ["Reason 1", "Reason 2", "Reason 3"];

// Function to get random elements from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to generate a random change site list
const getRandomSites = () => {
    const numSites = Math.floor(Math.random() * 3) + 1; // 1 to 3 sites
    const selectedSites = [];
    while (selectedSites.length < numSites) {
        const site = getRandomElement(sites);
        if (!selectedSites.includes(site)) selectedSites.push(site);
    }
    return selectedSites.join(",");
};

// Function to generate random change request dates
const generateDatesForMonth = (year, month) => {
    const numRequests = Math.floor(Math.random() * 31) + 30; // 30 to 60 per month
    const dates = [];

    for (let i = 0; i < numRequests; i++) {
        const day = Math.floor(Math.random() * 28) + 1; // To avoid issues with Feb
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);

        // Create the date in local time (GMT+7)
        const localDate = new Date(year, month - 1, day, hour, minute);

        // Adjust to GMT+7
        const gmtPlus7Offset = 7 * 60; // 7 hours in minutes
        localDate.setMinutes(localDate.getMinutes() + gmtPlus7Offset);

        // Format the date to ISO string and remove the "Z" to make it local time
        dates.push(localDate.toISOString().slice(0, 19).replace("T", " "));
    }
    return dates;
};

// Function to generate dummy data and insert into the database
const insertDummyData = async () => {
    console.log("Starting dummy data generation...");

    let sql = `INSERT INTO ChangeRequest (
      category, reason, impact, priority, change_name, change_sites, 
      common_change, request_change_date, latest_schedule_date, achieve_2_week_change_request, 
      approval, change_status, cancel_change_reason, cancel_change_category
  ) VALUES ?`;

    let values = [];

    // Loop through months from Jan 2023 to Feb 2025
    for (let year = 2023; year <= 2025; year++) {
        for (let month = 1; month <= 12; month++) {
            if (year === 2025 && month > 2) break; // Stop after Feb 2025

            let requestDates = generateDatesForMonth(year, month);

            requestDates.forEach((date) => {
                let category = getRandomElement(categories);
                let reason = getRandomElement(reasons);
                let impact = getRandomElement(impacts);
                let priority = getRandomElement(priorities);
                let change_name = faker.lorem.words(5);
                let change_sites = getRandomSites();
                let common_change = change_sites.includes(",") ? true : false;
                let achieve_2_week_change_request = Math.random() < 0.3; // 70% false, 30% true
                let approval = Math.random() < 0.8 ? "YES" : "NO"; // 80% YES
                let change_status = approval === "YES"
                    ? getRandomElement(["Completed with no issue", ""])
                    : getRandomElement(changeStatuses.filter(s => s !== "Completed with no issue"));
                let cancel_change_reason = change_status !== "Completed with no issue" ? faker.lorem.sentence() : null;
                let cancel_change_category = change_status !== "Completed with no issue" ? getRandomElement(cancelReasons) : null;

                // Generate latest_schedule_date (randomized 3 to 7 days after request date)
                let latest_schedule_date = moment(date, "YYYY-MM-DD HH:mm:ss")
                    .add(Math.floor(Math.random() * 5) + 3, "days") // Add 3 to 7 days
                    .format("YYYY-MM-DD");

                values.push([
                    category, reason, impact, priority, change_name, change_sites,
                    common_change, date, latest_schedule_date, achieve_2_week_change_request,
                    approval, change_status, cancel_change_reason, cancel_change_category
                ]);
            });
        }
    }

    try {
        await db.promise().query(sql, [values]);
        console.log("✅ Successfully inserted dummy data.");
    } catch (error) {
        console.error("❌ Database error:", error);
    }
};

module.exports = insertDummyData;

