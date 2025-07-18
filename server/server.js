const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const express = require('express');
const path = require('path');
const cors = require('cors');

// Database connection
const connectDB = require('./src/config/db.js');
const seedPrimeUsers = require('./src/utils/seedPrimeUsers');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://mocha-payment-y1ka-44wuwy12a-catchmeinreallifes-projects.vercel.app'] 
        : ['http://localhost:5173', 'http://localhost:3000'],
}));

// Serve static files from the "public" directory
// Serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
  });
}
 

// Set the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const walletRoutes = require('./src/routes/walletRoutes');


// API Routes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes); // Alternative path for frontend compatibility
app.use('/api/wallet', walletRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'MochaPay API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Client landing page
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// 404 handler for API routes
app.use('/api', (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 MochaPay server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Connect to database
    await connectDB();
    
    // Seed prime users
    await seedPrimeUsers();
    
    console.log('✅ Server initialization completed');
});