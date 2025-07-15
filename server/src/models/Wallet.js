const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    accountId: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Balance cannot be negative']
    },
    currency: {
        type: String,
        default: 'MochaCoin',
        enum: ['MochaCoin']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastTransactionAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
// walletSchema.index({ accountId: 1 });
// walletSchema.index({ userId: 1 });

// Method to update balance
walletSchema.methods.updateBalance = function(amount, type = 'credit') {
    if (type === 'credit') {
        this.balance += amount;
    } else if (type === 'debit') {
        if (this.balance < amount) {
            throw new Error('Insufficient balance');
        }
        this.balance -= amount;
    }
    this.lastTransactionAt = new Date();
    return this.save();
};

module.exports = mongoose.model('Wallet', walletSchema);