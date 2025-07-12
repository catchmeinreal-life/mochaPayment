/**
 * @file authRoutes.js
 * @description This file contains the authentication routes for user registration and login.
 * 
 */

const express = require('express');
const router = express.Router();

// const User = require('../config/.js')

// controllers (validation)
const validateMovie = require('../controllers/moviesController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/login',authMiddleware, (req, res) => {
    res.status(200).json({ message : "welcome to mochaPay"});
});

router.post('/login', (req, res) => {
    res.status(200).json({message: "login to home page"})
});

router.post('/signup', (req, res) => {
    res.status(200).json({message: "user registered"})
});



module.exports = router;

// ### 🔐 1. Authentication Flow
// - **Login Endpoint:** Users authenticate via `/api/auth/login` using valid credentials or OAuth (Google/GitHub).
// - **Token Issuance:** Upon successful login, the server responds with an encrypted JWT token stored in HTTP-only cookies or localStorage.
// - **Session Validation:** Protected endpoints validate the token on each request using middleware to ensure secure access.