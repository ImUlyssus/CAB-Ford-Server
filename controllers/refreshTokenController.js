const db = require('../config/db');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);  // No cookie found
    const refreshToken = cookies.jwt;
    try {
        // Find user by refresh token in the database
        const [rows] = await db.promise().query(
            "SELECT * FROM Users WHERE refreshToken = ?",
            [refreshToken]
        );
        const foundUser = rows[0];
        console.log("I am from refreshtoken: ", foundUser)
        if (!foundUser) return res.sendStatus(403);  // Forbidden if no user found

        // Verify refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.email !== decoded.email) {
                    console.log("Refresh token verification failed:", err);
                    return res.sendStatus(403);  // Forbidden if verification fails
                }

                // Create a new access token
                const accessToken = jwt.sign(
                    { "email": decoded.email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '10m' }  // Adjust expiration as needed
                );

                // Update access token in the database
                db.promise().query(
                    "UPDATE Users SET accessToken = ? WHERE email = ?",
                    [accessToken, foundUser.email]
                ).catch(err => {
                    console.error("Failed to update access token in DB:", err);
                    return res.sendStatus(500);  // Internal server error if DB update fails
                });

                // Send new access token to the user
                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.error("❌ Error in handleRefreshToken:", err);
        res.sendStatus(500);  // Internal server error
    }
};

module.exports = { handleRefreshToken };
