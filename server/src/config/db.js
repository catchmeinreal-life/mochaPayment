const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to mongoDb local');
        
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;