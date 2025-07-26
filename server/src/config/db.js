const mongoose = require('mongoose');


const connectDB = async () => {
    try {//mongodb://localhost:27017/
        if (process.env.NODE_ENV === 'production') {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('running on the cloud');
        } else {
            await mongoose.connect(process.env.MONGO_URI_local);
            console.log('connected to mongoDb local');
        }
        
    } catch (error) {
        console.error("problem connecting to database:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;