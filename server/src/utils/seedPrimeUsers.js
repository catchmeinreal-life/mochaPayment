const User = require('../models/User');
const Wallet = require('../models/Wallet');

const seedPrimeUsers = async () => {
    try {
        console.log('Seeding prime users...');

        // Check if admin user exists
        let adminUser = await User.findOne({ accountId: process.env.ADMIN_ACCOUNT_ID });
        
        if (!adminUser) {
            adminUser = new User({
                username: 'admin',
                email: 'admin@mochapay.com',
                password: 'admin123', // This will be hashed automatically
                accountId: process.env.ADMIN_ACCOUNT_ID,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Admin user created');

            // Create admin wallet
            const adminWallet = new Wallet({
                userId: adminUser._id,
                accountId: adminUser.accountId,
                balance: parseInt(process.env.ADMIN_INITIAL_BALANCE) || 1000000
            });
            await adminWallet.save();
            console.log('Admin wallet created with balance:', adminWallet.balance);
        }

        // Check if partner user exists
        let partnerUser = await User.findOne({ accountId: process.env.PARTNER_ACCOUNT_ID });
        
        if (!partnerUser) {
            partnerUser = new User({
                username: 'partner',
                email: 'partner@mochapay.com',
                password: 'partner123', // This will be hashed automatically
                accountId: process.env.PARTNER_ACCOUNT_ID,
                role: 'partner'
            });
            await partnerUser.save();
            console.log('Partner user created');

            // Create partner wallet
            const partnerWallet = new Wallet({
                userId: partnerUser._id,
                accountId: partnerUser.accountId,
                balance: parseInt(process.env.PARTNER_INITIAL_BALANCE) || 500000
            });
            await partnerWallet.save();
            console.log('Partner wallet created with balance:', partnerWallet.balance);
        }

        console.log('Prime users seeding completed');

    } catch (error) {
        console.error('Error seeding prime users:', error);
    }
};

module.exports = seedPrimeUsers;