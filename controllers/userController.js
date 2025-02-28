const bcrypt = require('bcrypt');
const db = require("../config/db");

const createUser = async (req, res) => {
  const { username, email, password, site } = req.body;

  // Validate the input (this should ideally be done beforehand)
  if (!username || !email || !password || !site) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if the email already exists
    const [rows] = await db.promise().query('SELECT email FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists. Please use another email or recover your account from 'Forgot Password'" });
    }

    // SQL query to insert the new user
    const query = 'INSERT INTO users (name, email, password, site) VALUES (?, ?, ?, ?)';
    await db.promise().query(query, [username, email, hashedPassword, site]);

    // Return the new user data directly from req.body (without needing to query the DB)
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
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

module.exports = { createUser };