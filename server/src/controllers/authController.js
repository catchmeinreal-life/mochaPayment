const User = require('../models/User.js');

module.exports = loginUser = async (req, res) => {

    const {email, password} = req.body;
    //check for email
    const user = await User.findOne({email});
    if (!user) {
        return res.status(204).json({message: "no user by that email"});
    }
}


