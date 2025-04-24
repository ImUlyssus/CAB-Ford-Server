const db = require("../config/db");

const createInformational = async (req, res) => {
    try {
        const {
            information_name,
            change_sites,
            description,
            contact,
            reference,
            remarks,
            startDateTime,
            endDateTime,
        } = req.body;
        console.log(change_sites)
        // Validate required fields
        if (!information_name || !change_sites || !change_sites) {
            return res.status(400).json({ message: "Information name and change sites (array) are required." });
        }

        // Convert change_sites object to a string for database storage (adjust as needed)
        // const change_sites_string = JSON.stringify(change_sites);

        // Construct the SQL query
        const query = `
            INSERT INTO Informational (
                information_name,
                change_sites,
                description,
                contact,
                reference,
                remarks,
                startDateTime,
                endDateTime
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Execute the query
        const [result] = await db.promise().query(query, [
            information_name,
            change_sites,
            description,
            contact,
            reference,
            remarks,
            startDateTime,
            endDateTime,
        ]);

        // Get the ID of the newly inserted row
        const informationalId = result.insertId;

        // Fetch the newly created informational item from the database
        const [newInformationalItem] = await db.promise().query(
            "SELECT * FROM Informational WHERE id = ?",
            [informationalId]
        );

        // Send the new informational item back to the client
        res.status(201).json(newInformationalItem[0]);
    } catch (error) {
        console.error("Error creating informational:", error);
        res.status(500).json({ message: "Failed to create informational." });
    }
};

module.exports = { createInformational };
