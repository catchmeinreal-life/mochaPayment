const dotenv = require('dotenv');
const express = require('express');
//path
const path = require('path');

//cors
const cors = express('cors');


dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());

app.use(cors);

// serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// set the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//routes
const moviesRoute = require('./src/routes/moviesRoutes.js')
app.use('/movies', moviesRoute);

//payment api
const demoUsers = [
    { name: "Matutu", accountNumber: "123456789", balance: 500},
    { name: "Bob", accountNumber: "987654321", balance: 800}
]

app.post('/pay', (req, res) => {
    const { sender, receiver, amount } = req.body;   //account numbers

    const senderAccount = demoUsers.find( (user) => user.accountNumber === sender);
    const receiverAccount = demoUsers.find( (user) => user.accountNumber === receiver);

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


// Render HTML file
app.get('/', (req, res) =>{
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.get('/contact', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'views', 'contact.html'));
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`)
})