const User = require('../models/User.JS');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '5m'});
}

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    //check for email
    const user = await User.findOne({email});
    if (!user) {
        return res.status(204).json({message: "no user by that email"});
    }
}

exports.registerUser = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(204).json({message: "email already in use"})
        }
        const user = await User.create({username, email, password});
        
        res.status(200).json({
            token: generateToken(user._id),
            message: "user registered succesfully",
            user: user,
        })
    } catch (error) {
        console.log("error registering user", error.message);
        res.status(500).json({error: error.message});
    }
}


