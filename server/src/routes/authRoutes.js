const express = require('express');
const router = express.Router();
const usersDb = require('../config/usersDb');

// Public routes
router.get('/message', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: "Welcome to MochaPay - Blockchain Payment System" 
  });
});

// User registration
router.post('/signup', async (req, res) => {
  try {
    const result = await usersDb.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const result = await usersDb.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Token verification
router.get('/verify/:token', (req, res) => {
  try {
    const result = usersDb.verifyToken(req.params.token);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
      verified: false
    });
  }
});

// Get user profile (protected route)
router.get('/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const result = usersDb.verifyToken(token);
    res.status(200).json({
      success: true,
      data: result.user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;