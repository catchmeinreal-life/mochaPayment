const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// Get wallet balance
exports.getWalletBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                accountId: wallet.accountId,
                balance: wallet.balance,
                currency: wallet.currency,
                lastTransactionAt: wallet.lastTransactionAt
            }
        });

    } catch (error) {
        console.error('Get wallet balance error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Transfer MochaCoins
exports.transferCoins = async (req, res) => {
    try {
        const { toAccountId, amount, description } = req.body;

        // Validation
        if (!toAccountId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Recipient account ID and amount are required'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        // Get sender wallet
        const senderWallet = await Wallet.findOne({ userId: req.user.id });
        
        if (!senderWallet) {
            return res.status(404).json({
                success: false,
                message: 'Sender wallet not found'
            });
        }

        // Check if sender has sufficient balance
        if (senderWallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance'
            });
        }

        // Get receiver wallet
        const receiverWallet = await Wallet.findOne({ accountId: toAccountId });
        
        if (!receiverWallet) {
            return res.status(404).json({
                success: false,
                message: 'Recipient wallet not found'
            });
        }

        // Check if sender is not sending to themselves
        if (senderWallet.accountId === toAccountId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot transfer to your own account'
            });
        }

        // Create transaction record
        const transaction = new Transaction({
            fromAccountId: senderWallet.accountId,
            toAccountId: toAccountId,
            amount: amount,
            type: 'transfer',
            status: 'pending',
            description: description || `Transfer from ${senderWallet.accountId} to ${toAccountId}`
        });

        await transaction.save();

        try {
            // Perform the transfer
            await senderWallet.updateBalance(amount, 'debit');
            await receiverWallet.updateBalance(amount, 'credit');

            // Update transaction status
            transaction.status = 'completed';
            await transaction.save();

            // Get receiver user info for response
            const receiverUser = await User.findById(receiverWallet.userId).select('username email');

            res.status(200).json({
                success: true,
                message: 'Transfer completed successfully',
                data: {
                    transaction: {
                        transactionId: transaction.transactionId,
                        fromAccountId: transaction.fromAccountId,
                        toAccountId: transaction.toAccountId,
                        amount: transaction.amount,
                        currency: transaction.currency,
                        status: transaction.status,
                        description: transaction.description,
                        createdAt: transaction.createdAt
                    },
                    senderBalance: senderWallet.balance,
                    receiverInfo: {
                        accountId: receiverWallet.accountId,
                        username: receiverUser?.username
                    }
                }
            });

        } catch (transferError) {
            // If transfer fails, mark transaction as failed
            transaction.status = 'failed';
            await transaction.save();
            throw transferError;
        }

    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during transfer'
        });
    }
};

// Get transaction history
exports.getTransactionHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query;
        
        const wallet = await Wallet.findOne({ userId: req.user.id });
        
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        // Build query
        const query = {
            $or: [
                { fromAccountId: wallet.accountId },
                { toAccountId: wallet.accountId }
            ]
        };

        if (type) {
            query.type = type;
        }

        // Get transactions with pagination
        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalTransactions = await Transaction.countDocuments(query);

        // Format transactions for response
        const formattedTransactions = transactions.map(tx => ({
            transactionId: tx.transactionId,
            fromAccountId: tx.fromAccountId,
            toAccountId: tx.toAccountId,
            amount: tx.amount,
            currency: tx.currency,
            type: tx.type,
            status: tx.status,
            description: tx.description,
            direction: tx.fromAccountId === wallet.accountId ? 'outgoing' : 'incoming',
            createdAt: tx.createdAt
        }));

        res.status(200).json({
            success: true,
            data: {
                transactions: formattedTransactions,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalTransactions / limit),
                    totalTransactions,
                    hasNextPage: page < Math.ceil(totalTransactions / limit),
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get transaction history error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};