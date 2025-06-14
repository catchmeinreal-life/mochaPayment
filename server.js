const dotenv = require('dotenv');
const express = require('express');
//path
const path = require('path');

//cors
const cors = require('cors');


dotenv.config({ path: './config.env' });

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
app.use('/movies', moviesRoute);
app.use('/pay', paymentRoute);






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