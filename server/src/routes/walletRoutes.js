const express = require('express');
const router = express.Router();

const {
    getWalletBalance,
    transferCoins,
    getTransactionHistory
} = require('../controllers/walletController');
const { transferWithPin } = require('../controllers/transferWithPin');

const { protect } = require('../middleware/authMiddleware');

// All wallet routes are protected
// router.use(protect);

// Wallet routes
router.get('/balance', protect, getWalletBalance);
router.post('/transfer', protect, transferCoins);
router.get('/transactions', protect, getTransactionHistory);
router.post('/transfer/pin', transferWithPin);

module.exports = router;
