const express = require('express');
const router = express.Router();

const {
    getWalletBalance,
    transferCoins,
    getTransactionHistory
} = require('../controllers/walletController');

const { protect } = require('../middleware/authMiddleware');

// All wallet routes are protected
router.use(protect);

// Wallet routes
router.get('/balance', getWalletBalance);
router.post('/transfer', transferCoins);
router.get('/transactions', getTransactionHistory);

module.exports = router;