require('dotenv').config(); // Load environment variables at the top

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movies'); // Import the routes
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// MongoDB connection
connectDB();

// Routes
app.use('/api', movieRoutes); // Use the routes

app.get('/', (req, res) => {
  res.send('Hello, MUHacks!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});