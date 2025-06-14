const dotenv = require('dotenv');
const express = require('express');
//path
const path = require('path');


dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());

// serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// set the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//routes
const moviesRoute = require('./src/routes/moviesRoutes.js')
app.use('/movies', moviesRoute);


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