// Enhanced User Management System for MochaPay
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MochaCoin to KES conversion rate
const COIN_TO_KES_RATE = 150; // 1 MochaCoin = 150 KES
const NEW_USER_COINS = 3; // New users get 3 MochaCoins (450 KES value)

class User {
  constructor(users) {
    this.users = users || [];
  }

  // Generate unique account ID
  generateAccountId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `MC_${timestamp}_${randomStr}`.toUpperCase();
  }

  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'mochapay_secret_key', {
      expiresIn: '24h'
    });
  }

  // Hash password
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Register new user
  async registerUser(userData) {
    const { username, email, password } = userData;

    // Check if user already exists
    const existingUser = this.users.find(user => 
      user.email === email || user.username === username
    );

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create new user
    const newUser = {
      id: this.users.length + 1,
      username,
      email,
      password: hashedPassword,
      accountNumber: this.generateAccountId(),
      balance: NEW_USER_COINS, // 3 MochaCoins for new users
      role: 'user',
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    };

    // Deduct coins from admin account
    const adminUser = this.users.find(user => user.role === 'admin');
    if (adminUser && adminUser.balance >= NEW_USER_COINS) {
      adminUser.balance -= NEW_USER_COINS;
    }

    // Add user to database
    this.users.push(newUser);

    // Generate token
    const token = this.generateToken(newUser.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
      token,
      coinValue: `${NEW_USER_COINS} MochaCoins (${NEW_USER_COINS * COIN_TO_KES_RATE} KES)`
    };
  }

  // Login user
  async loginUser(credentials) {
    const { email, password } = credentials;

    // Find user by email
    const user = this.users.find(u => u.email === email && u.isActive);
    
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

    // Generate token
    const token = this.generateToken(user.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    };
  }

  // Verify token and get user
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mochapay_secret_key');
      const user = this.users.find(u => u.id === decoded.id && u.isActive);
      
      if (!user) {
        throw new Error('User not found or inactive');
      }

      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword,
        verified: true
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Get user by ID
  getUserById(userId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Make payment between users
  makePayment(senderAccount, receiverAccount, amount) {
    const sender = this.users.find(user => user.accountNumber === senderAccount);
    const receiver = this.users.find(user => user.accountNumber === receiverAccount);

    if (!sender || !receiver) {
      return { error: "Invalid account number(s)" };
    }

    if (sender.balance < amount) {
      return { error: "Insufficient balance" };
    }

    sender.balance -= amount;
    receiver.balance += amount;

    return { 
      message: "Payment successful", 
      sender: { ...sender, password: undefined }, 
      receiver: { ...receiver, password: undefined }
    };
  }

  // Get user balance
  getUserBalance(accountNumber) {
    const user = this.users.find(user => user.accountNumber === accountNumber);
    if (!user) {
      return { error: "User not found" };
    }
    return { balance: user.balance };
  }

  // Get all users (without passwords)
  getAllUsers() {
    return this.users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

// Initialize with admin and partner users

/**
 * const adminSchema = 
 */
const demoUsers = [
  { 
    id: 1,
    name: "Admin User", 
    username: "admin",
    email: "admin@mochapay.com",
    password: "$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6FqjKQ4qAqHf.ch/.OFVOWt0wKtZn6i", // hashed "admin123"
    accountNumber: "MC_ADMIN_001", 
    balance: 10000, // 10,000 MochaCoins (1.5M KES)
    role: "admin",
    createdAt: new Date(),
    lastLogin: null,
    isActive: true
  },
  { 
    id: 2,
    name: "Partner User", 
    username: "partner",
    email: "partner@mochapay.com",
    password: "$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6FqjKQ4qAqHf.ch/.OFVOWt0wKtZn6i", // hashed "partner123"
    accountNumber: "MC_PARTNER_001", 
    balance: 5000, // 5,000 MochaCoins (750K KES)
    role: "partner",
    createdAt: new Date(),
    lastLogin: null,
    isActive: true
  }
];

const usersDb = new User(demoUsers);
