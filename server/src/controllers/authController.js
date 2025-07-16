const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '10m'
    });
};

/**
 * new users receieve 
 * 3 mochaCoins
 */
const initialAward = () => {
    return parseInt(process.env.NEW_USER_COINS);
};

// Get prime user wallet for balance allocation
const getPrimeUserWallet = async () => {
    // Try to get admin wallet first, then partner wallet
    let primeWallet = await Wallet.findOne({ 
        accountId: process.env.ADMIN_ACCOUNT_ID 
    });
    
    if (!primeWallet || primeWallet.balance < 1000) {
        primeWallet = await Wallet.findOne({ 
            accountId: process.env.PARTNER_ACCOUNT_ID 
        });
    }
    
    return primeWallet;
};

// User registration
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Create new user
        const user = new User({ username, email, password });
        
        // Generate unique account ID
        user.accountId = user.generateAccountId();
        
        // Save user
        await user.save();

        // Generate random balance for new user
        const initialBalance = initialAward();

        // Create wallet for user
        const wallet = new Wallet({
            userId: user._id,
            accountId: user.accountId,
            balance: initialBalance
        });

        await wallet.save();

        // Get prime user wallet for deduction
        const primeWallet = await getPrimeUserWallet();
        
        if (primeWallet && primeWallet.balance >= initialBalance) {
            // Deduct from prime user wallet
            await primeWallet.updateBalance(initialBalance, 'debit');

            // Create transaction record
            const transaction = new Transaction({
                fromAccountId: primeWallet.accountId,
                toAccountId: user.accountId,
                amount: initialBalance,
                type: 'initial_allocation',
                status: 'completed',
                description: `Initial MochaCoin allocation for new user: ${username}`
            });

            await transaction.save();
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    accountId: user.accountId,
                    role: user.role
                },
                wallet: {
                    accountId: wallet.accountId,
                    balance: wallet.balance,
                    currency: wallet.currency
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
};

// User login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email, isActive: true });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Get user wallet
        const wallet = await Wallet.findOne({ userId: user._id });

        // Generate JWT token
        const token = generateToken(user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    accountId: user.accountId,
                    role: user.role,
                    lastLogin: user.lastLogin
                },
                wallet: wallet ? {
                    accountId: wallet.accountId,
                    balance: wallet.balance,
                    currency: wallet.currency
                } : null,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
};

// Token verification
exports.verifyToken = async (req, res) => {
    try {
        const token = req.params.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token not provided',
                verified: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token or user not found',
                verified: false
            });
        }

        const wallet = await Wallet.findOne({ userId: user._id });

        res.status(200).json({
            success: true,
            message: 'Token verified successfully',
            verified: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    accountId: user.accountId,
                    role: user.role
                },
                wallet: wallet ? {
                    accountId: wallet.accountId,
                    balance: wallet.balance,
                    currency: wallet.currency
                } : null
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                verified: false
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                verified: false
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while validating token',
            verified: false
        });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const wallet = await Wallet.findOne({ userId: req.user.id });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    accountId: user.accountId,
                    role: user.role,
                    createdAt: user.createdAt,
                    lastLogin: user.lastLogin
                },
                wallet: wallet ? {
                    accountId: wallet.accountId,
                    balance: wallet.balance,
                    currency: wallet.currency,
                    lastTransactionAt: wallet.lastTransactionAt
                } : null
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};