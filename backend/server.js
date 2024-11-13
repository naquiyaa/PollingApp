const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDatabase = require("./config/database")
const userRoutes = require('./routes/userRoutes');
const pollRoutes = require('./routes/pollRoutes');

dotenv.config();  // Load environment variables from .env file
connectToDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json({ limit: '10mb' }));  // Adjust the limit as needed // Parse incoming JSON requests
app.use("/api/polls", pollRoutes);
app.use("/api/users", userRoutes);


// Sample test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
