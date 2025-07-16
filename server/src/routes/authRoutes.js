const express = require('express');
const router = express.Router();

/**Authentication controllers for user
 * registration & login
 * 
 */
const { registerUser, loginUser, verifyToken } = require('../controllers/authController')

// Public routes
router.get('/message', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: "Welcome to MochaPay - Blockchain Payment System" 
  });
});

// User registration
router.post('/signup', registerUser);

// User login
router.post('/login', loginUser);

// Token verification
router.get('/verify/:token', verifyToken);

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