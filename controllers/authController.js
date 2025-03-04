const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if the user exists
        const [rows] = await db.promise().query(
            "SELECT * FROM Users WHERE email = ?",
            [email]
        );
        const foundUser = rows[0];

        if (!foundUser) {
            return res.sendStatus(401);  // Unauthorized
        }

        // Compare passwords
        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            // Create JWTs
            const accessToken = jwt.sign(
                { "email": foundUser.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10m' }  // Adjust expiration as needed
            );

            const refreshToken = jwt.sign(
                { "email": foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            // Save access and refresh tokens in the database
            await db.promise().query(
                "UPDATE Users SET accessToken = ?, refreshToken = ? WHERE email = ?",
                [accessToken, refreshToken, email]
            );

            // Secure cookie for refresh token
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000  // 1 day
            });

            // Send access token to user
            res.json({ accessToken });

        } else {
            res.sendStatus(401);  // Unauthorized
        }

    } catch (err) {
        console.error("❌ Error in handleLogin:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { handleLogin };
