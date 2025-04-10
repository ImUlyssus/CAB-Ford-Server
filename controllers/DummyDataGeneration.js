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
    '_',
    'Completed with no issue',
    'Ongoing',
    'Postponed/Rejected',
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

// User data
const aatUsers = [
    { email: 'aatuser3@ford.com', name: 'aat user 3', site: 'AAT' },
    { email: 'aatuser4@ford.com', name: 'aat user 4', site: 'AAT' },
    { email: 'aatuser5@ford.com', name: 'aat user 5', site: 'AAT' }
];

const ftmUsers = [
    { email: 'ftmuser3@ford.com', name: 'ftm user 3', site: 'FTM' },
    { email: 'ftmuser4@ford.com', name: 'ftm user 4', site: 'FTM' },
    { email: 'ftmuser5@ford.com', name: 'ftm user 5', site: 'FTM' }
];

const fsstUsers = [
    { email: 'fsstuser3@ford.com', name: 'fsst user 3', site: 'FSST' },
    { email: 'fsstuser4@ford.com', name: 'fsst user 4', site: 'FSST' },
    { email: 'fsstuser5@ford.com', name: 'fsst user 5', site: 'FSST' }
];

// Function to get a random user for a specific site
const getRandomUser = (siteUsers) => {
    const user = getRandomElement(siteUsers);
    return `${user.name} ${user.email}`;
};

// Function to generate a random schedule entry
const generateScheduleEntry = (date) => {
    const startDate = moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DDTHH:mm");
    const endDate = moment(date, "YYYY-MM-DD HH:mm:ss").add(Math.floor(Math.random() * 3) + 1, "days").format("YYYY-MM-DDTHH:mm");
    const schedule_title = faker.lorem.words(3).replace(/ /g, "_");
    const status = getRandomElement(["Completed_with_no_issue", "In_progress", "On_plan", "Postponed/Canceled"]);
    const comment = faker.lorem.sentence().replace(/ /g, "_");
    const duration = (Math.random() * 999.9).toFixed(1); // Generates a number with up to 3 integer digits and 1 decimal place
    return `${startDate}!${endDate}!${schedule_title}!${status}!${comment}!${duration}`;
};

// Function to generate a random schedule string
const generateScheduleString = (date) => {
    let numEntries;
    const randomNumber = Math.random();

    if (randomNumber < 0.7) {
        numEntries = Math.floor(Math.random() * 2); // 0 or 1 entries (70% chance)
    } else {
        numEntries = Math.floor(Math.random() * 8) + 2; // 2 to 9 entries (30% chance)
    }

    let schedule = [];
    for (let i = 0; i < numEntries; i++) {
        schedule.push(generateScheduleEntry(date));
    }
    return schedule.join(" ");
};

// Function to generate dummy data and insert into the database
const insertDummyData = async () => {
    console.log("Starting dummy data generation...");

    // Add columns to the SQL query
    let sql = `INSERT INTO ChangeRequest (
        category, reason, impact, priority, change_name, change_sites, 
        common_change, request_change_date, latest_schedule_date, achieve_2_week_change_request, 
        approval, change_status, cancel_change_reason, cancel_change_category,
        aat_requestor, ftm_requestor, fsst_requestor, aat_schedule_change, ftm_schedule_change, fsst_schedule_change  -- Added columns
    ) VALUES ?`;

    let values = [];

    // Loop through months from Jan 2023 to Feb 2025
    for (let year = 2023; year <= 2025; year++) {
        for (let month = 1; month <= 12; month++) {
            if (year === 2025 && month > 11) break; // Stop after Feb 2025

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
                    ? getRandomElement(["Completed with no issue", "_"])
                    : getRandomElement(changeStatuses.filter(s => s !== "Completed with no issue"));
                let cancel_change_reason = change_status !== "Completed with no issue" ? faker.lorem.sentence() : null;
                let cancel_change_category = change_status !== "Completed with no issue" ? getRandomElement(cancelReasons) : null;

                // Generate latest_schedule_date (randomized 3 to 7 days after request date)
                let latest_schedule_date = moment(date, "YYYY-MM-DD HH:mm:ss")
                    .add(Math.floor(Math.random() * 5) + 3, "days") // Add 3 to 7 days
                    .format("YYYY-MM-DD");

                // Determine requestors based on change_sites
                let aat_requestor = change_sites.includes("aat") ? getRandomUser(aatUsers) : null;
                let ftm_requestor = change_sites.includes("ftm") ? getRandomUser(ftmUsers) : null;
                let fsst_requestor = change_sites.includes("fsst") ? getRandomUser(fsstUsers) : null;

                // Generate schedule change strings
                let aat_schedule_change = change_sites.includes("aat") ? generateScheduleString(date) : null;
                let ftm_schedule_change = change_sites.includes("ftm") ? generateScheduleString(date) : null;
                let fsst_schedule_change = change_sites.includes("fsst") ? generateScheduleString(date) : null;

                values.push([
                    category, reason, impact, priority, change_name, change_sites,
                    common_change, date, latest_schedule_date, achieve_2_week_change_request,
                    approval, change_status, cancel_change_reason, cancel_change_category,
                    aat_requestor, ftm_requestor, fsst_requestor, aat_schedule_change, ftm_schedule_change, fsst_schedule_change // Added values
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
