const db = require('../config/db');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    try {
        // Check if the refresh token exists in the database
        const [rows] = await db.promise().query(
            "SELECT * FROM Users WHERE refreshToken = ?",
            [refreshToken]
        );
        const foundUser = rows[0];

        if (!foundUser) {
            // If no user found, clear cookie and return 204
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        // Delete refreshToken and accessToken from the database
        await db.promise().query(
            "UPDATE Users SET refreshToken = NULL, accessToken = NULL WHERE email = ?",
            [foundUser.email]
        );

        // Clear the refresh token cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204); // Success, no content

    } catch (err) {
        console.error("❌ Error in handleLogout:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { handleLogout };
