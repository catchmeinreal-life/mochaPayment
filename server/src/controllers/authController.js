const User = require('../models/User.JS');

module.exports = loginUser = async (req, res) => {
    console.log(req.body);
    const {email, password} = req.body;
    //check for email
    const user = await User.findOne({email});
    console.log(user);
    if (!user) {
        return res.status(204).json({message: "no user by that email"});
    }
}


