const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const adminRoutes = require('./routes/adminroutes');
const authenticateJWT = require('./middleware/authjwt');

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON bodies

// Routes
app.use('/api/admin', adminRoutes);

// Protected route example (requires JWT authentication)
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route.', admin: req.admin });
});

// Basic route for testing server
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
