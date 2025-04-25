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
            date
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
                endDateTime,
                date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            date,
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

const getInformational = async (req, res) => {
    try {
        const { date } = req.query; // Get the date from the query parameters

        if (!date) {
            return res.status(400).json({ message: "Date parameter is required." });
        }

        const query = `
            SELECT * FROM Informational
            WHERE DATE(date) = ?
        `;

        const [results] = await db.promise().query(query, [date]);

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching informational data:", error);
        res.status(500).json({ message: "Failed to fetch informational data." });
    }
};

const deleteInformational = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters

        // Validate the ID
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required." });
        }

        // Construct the SQL query
        const query = `
            DELETE FROM Informational
            WHERE id = ?
        `;

        // Execute the query
        const [result] = await db.promise().query(query, [id]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Informational item not found." });
        }

        // Send success message
        res.status(200).json({ message: "Informational item deleted successfully." });
    } catch (error) {
        console.error("Error deleting informational item:", error);
        res.status(500).json({ message: "Failed to delete informational item." });
    }
};

module.exports = { createInformational, getInformational, deleteInformational };
