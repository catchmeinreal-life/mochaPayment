const express = require('express');

const router = express.Router();

// demo data
const demoUsers = require('../config/usersDb.js')

router.post('/', (req, res) => {
    console.log(req.body);
    const { sender, receiver, amount } = req.body;   //account numbers

    const senderAccount = demoUsers.default.find( (user) => user.accountNumber === sender);
    const receiverAccount = demoUsers.default.find( (user) => user.accountNumber === receiver);

    //handle case where accounts number is wrong
    if (!senderAccount || ! receiverAccount) {
        return res.status(400).json({error: "Invalid Accounts numbers"});
    }

    if (senderAccount.balance < amount ) {
        return res.status(400).json({error: "insufficiet funds"});
    }

    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    res.status(200).json({message: "Transaction successful", senderAccount, receiverAccount})
})

module.exports = router;