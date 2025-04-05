const bcrypt = require('bcrypt');
const db = require("../config/db");
const sendEmail = require("../routes/sendVerificationEmail"); 
const createUser = async (req, res) => {
    const { username, email, password, site, verificationCode } = req.body;

    // Validate the input
    if (!username || !email || !password || !site) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format (must end with @ford.com)
    if (!email.endsWith("@ford.com")) {
        return res.status(400).json({ message: "Email must end with @ford.com" });
    }

    try {
        // Check if the email already exists
        const [rows] = await db.promise().query("SELECT email FROM Users WHERE email = ?", [email]);
        if (rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists. Please use another email or recover your account from 'Forgot Password'",
            });
        }

        // Send OTP to user's email
        await sendEmail({ recipient_email: email, OTP: verificationCode })
            .then(() => {
                res.status(200).json({
                    message: "Verification email sent successfully. Please enter the OTP to complete registration.",
                    email: email,
                });
            })
            .catch((error) => {
                console.error("❌ Error sending email:", error);
                res.status(500).json({ message: "Failed to send verification email." });
            });

    } catch (error) {
        console.error("❌ Error during email verification:", error);
        res.status(500).json({ message: "Server error, please try again later." });
    }
};
const insertUser = async (req, res) => {
    const { username, email, password, site } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // 🔒 Secure hashing

        // Insert the verified user into the database
        const query = `
            INSERT INTO Users (name, email, password, site, accessToken, refreshToken)
            VALUES (?, ?, ?, ?, NULL, NULL)
        `;
        await db.promise().query(query, [username, email, hashedPassword, site]);

        // Respond with success message
        res.status(201).json({
            message: "User registered successfully",
            user: { 
                email, 
                name: username, 
                site, 
                createdAt: new Date().toISOString() 
            },
        });
    } catch (error) {
        console.error("❌ Error inserting user:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Fetch only necessary columns
        const [rows] = await db.promise().query("SELECT email, name, site FROM Users");

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({
            message: "Server error, please try again later",
            error: error.message, // For debugging
        });
    }
};


module.exports = { createUser, insertUser, getAllUsers };
