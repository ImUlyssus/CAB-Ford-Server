const db = require("../config/db");

const createRemarksSummary = async (req, res) => {
    try {
        const {
            aat_remark,
            ftm_remark,
            fsst_remark,
            common_remark,
            date
        } = req.body;
        // Validate required fields
        if (!date) {
            return res.status(400).json({ message: "Date is required." });
        }


        // Construct the SQL query
        const query = `
            INSERT INTO SummaryRemarks (
                common_remark,
                aat_remark,
                ftm_remark,
                fsst_remark,
                date
            ) VALUES (?, ?, ?, ?, ?)
        `;

        // Execute the query
        const [result] = await db.promise().query(query, [
            common_remark,
            aat_remark,
            ftm_remark,
            fsst_remark,
            date
        ]);

        // Get the ID of the newly inserted row
        const summaryRemarkId = result.insertId;

        // Fetch the newly created informational item from the database
        const [summaryRemarkItem] = await db.promise().query(
            "SELECT * FROM SummaryRemarks WHERE id = ?",
            [summaryRemarkId]
        );

        // Send the new informational item back to the client
        res.status(201).json(summaryRemarkItem[0]);
    } catch (error) {
        console.error("Error creating summay remark:", error);
        res.status(500).json({ message: "Failed to create summary remark." });
    }
};

const getRemarksSummary = async (req, res) => {
    try {
        const { date } = req.query; // Get the date from the query parameters

        if (!date) {
            return res.status(400).json({ message: "Date parameter is required." });
        }

        const query = `
            SELECT * FROM SummaryRemarks
            WHERE DATE(date) = ?
        `;

        const [results] = await db.promise().query(query, [date]);

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching informational data:", error);
        res.status(500).json({ message: "Failed to fetch informational data." });
    }
};
const deleteRemarksSummary = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters

        // Validate the ID
        if (!id) {
            return res.status(400).json({ message: "ID parameter is required." });
        }

        // Construct the SQL query
        const query = `
            DELETE FROM SummaryRemarks
            WHERE id = ?
        `;

        // Execute the query
        const [result] = await db.promise().query(query, [id]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Remark summary item not found." });
        }

        // Send success message
        res.status(200).json({ message: "Remark summary item deleted successfully." });
    } catch (error) {
        console.error("Error deleting remark summary item:", error);
        res.status(500).json({ message: "Failed to delete remark summary." });
    }
};

module.exports = { createRemarksSummary, getRemarksSummary, deleteRemarksSummary };
