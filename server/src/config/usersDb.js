const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

// Constants
const NEW_USER_COINS = 3;
const COIN_TO_KES_RATE = 150;
const JWT_SECRET = process.env.JWT_SECRET || 'mochapay_secret_key';
const SALT_ROUNDS = 12;

/**
 * MongoDB-backed User Management System for MochaPay
 * Handles user authentication, registration, and token management
 */
class UserDatabase {
  
  /**
   * Generate JWT token for user
   * @param {string} userId - MongoDB ObjectId
   * @returns {string} JWT token
   */
  generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: '24h'
    });
  }

  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hashed password
   * @param {string} candidatePassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} Password match result
   */
  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Register new user with MongoDB persistence
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Plain text password
   * @returns {Promise<Object>} Registration result
   */
  async registerUser(userData) {
    const { username, email, password } = userData;

    // Validation
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Start MongoDB transaction for atomic user and wallet creation
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role: 'user',
        isActive: true
      });

      // Generate unique account ID
      user.accountId = user.generateAccountId();

      // Save user to database
      // await user.save({ session });
      await user.save();

      // Create wallet for user
      const wallet = new Wallet({
        userId: user._id,
        accountId: user.accountId,
        balance: NEW_USER_COINS
      });

      // await wallet.save({ session });
      await wallet.save();

      // Commit transaction
      // await session.commitTransaction();

      // Generate JWT token
      const token = this.generateToken(user._id);

      // Return user data without password
      return {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          accountId: user.accountId,
          role: user.role
        },
        token,
        coinValue: `${NEW_USER_COINS} MochaCoins (${NEW_USER_COINS * COIN_TO_KES_RATE} KES)`
      };

    } catch (error) {
      // Rollback transaction on error
      // await session.abortTransaction();
      throw error;
    } finally {
      // End session
      // session.endSession();
    }
  }

  /**
   * Login user with MongoDB authentication
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Email address
   * @param {string} credentials.password - Plain text password
   * @returns {Promise<Object>} Login result
   */
  async loginUser(credentials) {
    const { email, password } = credentials;

    // Validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user by email
    const user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await this.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = this.generateToken(user._id);

    // Return user data without password
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountId: user.accountId,
        role: user.role
      },
      token
    };
  }

  /**
   * Verify JWT token and get user data
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Token verification result
   */
  async verifyToken(token) {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find user by decoded ID
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      return {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          accountId: user.accountId,
          role: user.role
        },
        verified: true
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid or expired token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new Error('Invalid or expired token');
      }
      throw error;
    }
  }

  /**
   * Get user by MongoDB ObjectId
   * @param {string} userId - MongoDB ObjectId
   * @returns {Promise<Object>} User data without password
   */
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      accountId: user.accountId,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      isActive: user.isActive
    };
  }

  /**
   * Check if user exists by email
   * @param {string} email - Email address
   * @returns {Promise<boolean>} User existence status
   */
  async userExists(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  /**
   * Get user by account ID
   * @param {string} accountId - User account ID
   * @returns {Promise<Object>} User data without password
   */
  async getUserByAccountId(accountId) {
    const user = await User.findOne({ accountId, isActive: true }).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      accountId: user.accountId,
      role: user.role
    };
  }

  /**
   * Update user's last login timestamp
   * @param {string} userId - MongoDB ObjectId
   * @returns {Promise<void>}
   */
  async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date()
    });
  }

  /**
   * Deactivate user account
   * @param {string} userId - MongoDB ObjectId
   * @returns {Promise<void>}
   */
  async deactivateUser(userId) {
    await User.findByIdAndUpdate(userId, {
      isActive: false
    });
  }

  /**
   * Get all active users (admin function)
   * @returns {Promise<Array>} Array of user objects without passwords
   */
  async getAllUsers() {
    const users = await User.find({ isActive: true }).select('-password');
    return users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      accountId: user.accountId,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));
  }
}

// Create and export singleton instance
const usersDb = new UserDatabase();

module.exports = usersDb;