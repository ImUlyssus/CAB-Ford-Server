const db = require("../config/db"); // Import your database connection
const { faker } = require("@faker-js/faker");
const moment = require('moment-timezone');
// Define ENUM values for randomization
const {
    change_names,
    descriptions,
    test_plans,
    rollback_plans,
    contacts,
    global_and_business_contacts, // Added this import
    crqs,
    scheduleTitles,
    scheduleComments
} = require('./DummyText');

// Define ENUM values for randomization
const categories = ["Hardware", "Application", "New tech update", "Password reset"];
const reasons = ["Fix/Repair", "New functionality", "Maintenance", "Upgrade", "Tech refresh", "Yearly change"];
const impacts = ["Extensive", "Significant", "Moderate", "Minor"];
const priorities = ["Critical", "High", "Medium", "Low"];
const sites = ["aat", "ftm", "fsst"];
// Update approval to include 'Waiting' as per your database schema and frontend logic
const approvalOptions = ["YES", "NO", "Waiting"];
const changeStatuses = [
    '_',
    'Completed with no issue',
    'Ongoing',
    'Postponed/Rejected',
];
const cancelCategories = [ // Renamed from cancelReasons to match database column name
    '', // Added empty string for the default/NULL case
    'Cancel change',
    'Postpone scheduler',
    'Encountered error(s) during implementation',
    'Revisit the issue and conduct a thorough analysis',
    'Unable to contact to implementation team'
];

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

// User data (Keeping this as it's used for requestor fields, not contacts)
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
    // Format as "name email"
    return `${user.name} ${user.email}`;
};

// Function to generate a random schedule entry
const generateScheduleEntry = (date) => {
    const startDate = moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DDTHH:mm");
    const endDate = moment(date, "YYYY-MM-DD HH:mm:ss").add(Math.floor(Math.random() * 3) + 1, "days").format("YYYY-MM-DDTHH:mm");
    // Use imported scheduleTitles and scheduleComments, keep underscore replacement if needed for your parsing
    const schedule_title = getRandomElement(scheduleTitles).replace(/ /g, "_");
    const status = getRandomElement(["Completed_with_no_issue", "In_progress", "On_plan", "Postponed/Canceled"]);
    const comment = getRandomElement(scheduleComments).replace(/ /g, "_"); // Use imported comments
    const duration = (Math.random() * 999.9).toFixed(1);
    return `${startDate}!${endDate}!${schedule_title}!${status}!${comment}!${duration}`;
};

// Function to generate a random schedule string (1 to 3 entries)
const generateScheduleString = (date) => {
    // Generate a random number of entries between 1 and 3
    const numEntries = Math.floor(Math.random() * 3) + 1; // Generates 1, 2, or 3

    let schedule = [];
    for (let i = 0; i < numEntries; i++) {
        schedule.push(generateScheduleEntry(date));
    }
    return schedule.join(" ");
};

// Function to generate dummy data and insert into the database
const insertDummyData = async () => {
    console.log("Starting dummy data generation...");

    // Add all relevant columns to the SQL query
    let sql = `INSERT INTO ChangeRequest (
        category, reason, impact, priority, change_name, change_sites,
        common_change, request_change_date, latest_schedule_date, achieve_2_week_change_request,
        approval, change_status, cancel_change_reason, cancel_change_category,
        aat_requestor, ftm_requestor, fsst_requestor,
        aat_schedule_change, ftm_schedule_change, fsst_schedule_change,
        description, aat_test_plan, ftm_test_plan, fsst_test_plan, rollback_plan,
        ftm_it_contact, aat_it_contact, fsst_it_contact, global_team_contact, business_team_contact,
        ftm_crq, aat_crq, fsst_crq
    ) VALUES ?`;

    let values = [];

    // Loop through months from Jan 2023 to Feb 2025
    for (let year = 2023; year <= 2025; year++) {
        for (let month = 1; month <= 12; month++) {
            if (year === 2025 && month > 5) break; // Stop after Feb 2025 (Changed from 11 to 2)

            let requestDates = generateDatesForMonth(year, month);

            requestDates.forEach((date) => {
                let category = getRandomElement(categories);
                let reason = getRandomElement(reasons);
                let impact = getRandomElement(impacts);
                let priority = getRandomElement(priorities);
                // Use imported change_names
                let change_name = getRandomElement(change_names);
                let change_sites = getRandomSites();
                let common_change = change_sites.includes(",");
                let achieve_2_week_change_request = Math.random() < 0.3;
                // Use imported approvalOptions
                let approval = getRandomElement(approvalOptions);
                let change_status = approval === "YES"
                    ? getRandomElement(["Completed with no issue", "_"])
                    : getRandomElement(changeStatuses.filter(s => s !== "Completed with no issue"));
                // Use imported scheduleComments for cancel reason if status is not completed
                let cancel_change_reason = change_status !== "Completed with no issue" ? getRandomElement(scheduleComments) : null;
                // Use imported cancelCategories
                let cancel_change_category = change_status !== "Completed with no issue" ? getRandomElement(cancelCategories) : null;


                let latest_schedule_date = moment(date, "YYYY-MM-DD HH:mm:ss")
                    .add(Math.floor(Math.random() * 5) + 3, "days")
                    .format("YYYY-MM-DD");

                let aat_requestor = change_sites.includes("aat") ? getRandomUser(aatUsers) : null;
                let ftm_requestor = change_sites.includes("ftm") ? getRandomUser(ftmUsers) : null;
                let fsst_requestor = change_sites.includes("fsst") ? getRandomUser(fsstUsers) : null;

                let aat_schedule_change = change_sites.includes("aat") ? generateScheduleString(date) : null;
                let ftm_schedule_change = change_sites.includes("ftm") ? generateScheduleString(date) : null;
                let fsst_schedule_change = change_sites.includes("fsst") ? generateScheduleString(date) : null;

                // Use imported arrays for description, test plans, rollback plan, contacts, and CRQs
                let description = getRandomElement(descriptions);
                let rollback_plan = getRandomElement(rollback_plans);

                // Site-specific test plans using the general test_plans array
                let aat_test_plan = change_sites.includes("aat") ? getRandomElement(test_plans) : null;
                let ftm_test_plan = change_sites.includes("ftm") ? getRandomElement(test_plans) : null;
                let fsst_test_plan = change_sites.includes("fsst") ? getRandomElement(test_plans) : null;

                // Site-specific and general contacts using the contacts array
                let aat_it_contact = change_sites.includes("aat") ? getRandomElement(contacts) : null;
                let ftm_it_contact = change_sites.includes("ftm") ? getRandomElement(contacts) : null;
                let fsst_it_contact = change_sites.includes("fsst") ? getRandomElement(contacts) : null;
                let global_team_contact = getRandomElement(global_and_business_contacts); // Always generate a global contact
                let business_team_contact = getRandomElement(global_and_business_contacts); // Always generate a business contact

                // Site-specific CRQs using the crqs array
                let aat_crq = change_sites.includes("aat") ? getRandomElement(crqs) : null;
                let ftm_crq = change_sites.includes("ftm") ? getRandomElement(crqs) : null;
                let fsst_crq = change_sites.includes("fsst") ? getRandomElement(crqs) : null;


                values.push([
                    category, reason, impact, priority, change_name, change_sites,
                    common_change, date, latest_schedule_date, achieve_2_week_change_request,
                    approval, change_status, cancel_change_reason, cancel_change_category,
                    aat_requestor, ftm_requestor, fsst_requestor,
                    aat_schedule_change, ftm_schedule_change, fsst_schedule_change,
                    description, aat_test_plan, ftm_test_plan, fsst_test_plan, rollback_plan,
                    ftm_it_contact, aat_it_contact, fsst_it_contact, global_team_contact, business_team_contact,
                    ftm_crq, aat_crq, fsst_crq
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
