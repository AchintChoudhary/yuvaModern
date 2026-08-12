require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

// Initialize app
const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // For development, allow any client connection
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Support larger payloads for embedded base64 images if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'YUVA DUTY Backend REST API is running.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
