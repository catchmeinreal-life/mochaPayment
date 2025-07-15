const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    fromAccountId: {
        type: String,
        required: true
    },
    toAccountId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, 'Amount must be greater than 0']
    },
    currency: {
        type: String,
        default: 'MochaCoin',
        enum: ['MochaCoin']
    },
    type: {
        type: String,
        enum: ['transfer', 'initial_allocation', 'reward', 'fee'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Generate transaction ID
transactionSchema.pre('save', function(next) {
    if (!this.transactionId) {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        this.transactionId = `TXN_${timestamp}_${randomStr}`.toUpperCase();
    }
    next();
});

// Index for faster queries
transactionSchema.index({ toAccountId: 1 });
// transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);