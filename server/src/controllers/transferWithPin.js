const bcrypt = require('bcrypt');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// Transfer with PIN (password-based)
exports.transferWithPin = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount, pin } = req.body;

    if (!fromAccountId || !toAccountId || !amount || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Sender, recipient, amount, and PIN are required',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero',
      });
    }

    // Get sender wallet by fromAccountId
    const senderWallet = await Wallet.findOne({ accountId: fromAccountId });
    if (!senderWallet) {
      return res.status(404).json({ success: false, message: 'Sender wallet not found' });
    }

    // Get sender user by wallet.userId
    const senderUser = await User.findById(senderWallet.userId);
    if (!senderUser) {
      return res.status(404).json({ success: false, message: 'Sender user not found' });
    }

    // Verify password as PIN
    const isMatch = await bcrypt.compare(pin, senderUser.password);
    if (!isMatch) {
      return res.status(403).json({ success: false, message: 'Invalid PIN' });
    }

    if (senderWallet.accountId === toAccountId) {
      return res.status(400).json({ success: false, message: 'Cannot send to self' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    const receiverWallet = await Wallet.findOne({ accountId: toAccountId });
    if (!receiverWallet) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    // Create transaction
    const transaction = new Transaction({
      fromAccountId: senderWallet.accountId,
      toAccountId,
      amount,
      type: 'transfer',
      status: 'pending',
      description: `User-confirmed PIN transfer`,
    });

    await transaction.save();

    try {
      await senderWallet.updateBalance(amount, 'debit');
      await receiverWallet.updateBalance(amount, 'credit');

      transaction.status = 'completed';
      await transaction.save();

      const receiverUser = await User.findById(receiverWallet.userId).select('username email');

      return res.status(200).json({
        success: true,
        message: 'Transfer successful with PIN confirmation',
        data: {
          transaction: {
            transactionId: transaction.transactionId,
            fromAccountId: transaction.fromAccountId,
            toAccountId: transaction.toAccountId,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status,
            description: transaction.description,
            createdAt: transaction.createdAt,
          },
          senderBalance: senderWallet.balance,
          receiverInfo: {
            accountId: receiverWallet.accountId,
            username: receiverUser?.username || 'N/A',
          },
        },
      });
    } catch (transferErr) {
      transaction.status = 'failed';
      await transaction.save();
      throw transferErr;
    }
  } catch (err) {
    console.error('transferWithPin error:', err);
    res.status(500).json({ success: false, message: 'Server error during PIN transfer' });
  }
};
