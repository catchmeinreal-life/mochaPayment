const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const express = require('express');
const path = require('path'); //path
const cors = require('cors');//cors

// database
const connectDB = require('./src/config/db.js');

const app = express();
app.use(express.json());
app.use(cors());
// serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'))); 

// set the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//routes
const moviesRoute = require('./src/routes/moviesRoutes.js');
const paymentRoute = require('./src/routes/paymentRoutes.js');
const authRoutes = require('./src/routes/authRoutes.js')
app.use('/movies', moviesRoute);
app.use('/pay', paymentRoute);

//client landing page
app.use('/auth', authRoutes); 






// Render HTML file
app.get('/', (req, res) =>{
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.get('/contact', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'views', 'contact.html'));
})


const PORT = process.env.PORT;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port :${PORT}`)
})