require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const changeRequestRoutes = require("./routes/changeRequestRoutes");
const businessCalendarRoutes = require("./routes/businessCalendarRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const tokenRefreshRoutes = require('./routes/refresh');
const resendEmailRoute = require('./routes/resendEmail');
const insertDummyData = require("./controllers/DummyDataGeneration");
// const credentials = require('./middleware/credentials');
// const corsOptions = require('./config/corsOptions');


const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Only allow requests from this frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies (if needed)
  }));

// // built-in middleware to handle urlencoded form data
app.use(express.json()); // Middleware for parsing JSON
app.use(cookieParser());
// Routes
// users register
app.use("/api/users", userRoutes)
app.use("/api/login", authRoutes)
app.use('/api/refresh', tokenRefreshRoutes);
app.use('/api/logout', tokenRefreshRoutes);
app.use('/api/send-email-verification', resendEmailRoute);
// insertDummyData();
app.use(verifyJWT);
// everything under verify JWT must be authenticated to get access

// change request
app.use("/api/change-requests", changeRequestRoutes);

// business calendar
app.use("/api/business-calendar", businessCalendarRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
