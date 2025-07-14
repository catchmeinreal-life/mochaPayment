const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyToken,
    getUserProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/login', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: "Welcome to MochaPay - Blockchain Payment System" 
    });
});

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyToken);

// Protected routes
router.get('/profile', protect, getUserProfile);

module.exports = router;