require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const changeRequestRoutes = require("./routes/changeRequestRoutes");
const businessCalendarRoutes = require("./routes/businessCalendarRoutes");

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Only allow requests from this frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies (if needed)
  }));
app.use(express.json()); // Middleware for parsing JSON

// Routes
// change request
app.use("/api/change-requests", changeRequestRoutes);

// business calendar
app.use("/api/business-calendar", businessCalendarRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
