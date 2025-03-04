const bcrypt = require('bcrypt');
const db = require("../config/db");

const createUser = async (req, res) => {
    const { username, email, password, site } = req.body;

    // Validate the input
    if (!username || !email || !password || !site) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format (must end with @ford.com)
    if (!email.endsWith('@ford.com')) {
        return res.status(400).json({ message: 'Email must end with @ford.com' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if the email already exists
        const [rows] = await db.promise().query('SELECT email FROM Users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists. Please use another email or recover your account from 'Forgot Password'"
            });
        }

        // SQL query to insert the new user with NULL values for tokens
        const query = `
            INSERT INTO Users (name, email, password, site, accessToken, refreshToken)
            VALUES (?, ?, ?, ?, NULL, NULL)
        `;
        await db.promise().query(query, [username, email, hashedPassword, site]);

        // Return the new user data directly from req.body
        res.status(201).json({
            message: 'User created successfully',
            user: {
                email,
                name: username,
                site,
                createdAt: new Date().toISOString(), // Using current timestamp as an example for createdAt
            },
        });
    } catch (error) {
        console.error('❌ Error creating user:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

module.exports = { createUser };
