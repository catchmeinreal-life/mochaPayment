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


// Render HTML file
app.get('/', (req, res) =>{
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.get('/contact', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'views', 'contact.html'));
})



// in-memory database
const movies = [];

// Middleware for simple validation
const validateMovie = (req, res, next) => {
    if (!req.body.title || !req.body.genre || !req.body.year) {
        return res.status(400).send('Title, genre, and year are required');
    }
    next();
}

// GET all movies
app.get('/movies', (req, res)=>{
    res.status(200).json(movies);
    console.log('GET all movies', movies);
})

// get a paticular movie by id
app.get('/movies/:id', (req, res)=>{
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send('Movie not found');
    res.status(200).json(movie);
})

// POST a new movie
app.post('/movies', validateMovie, (req, res)=>{
    const movie = {
        id : movies.length + 1,
        title : req.body.title,
        genre: req.body.genre,
        year: req.body.year
    };
    movies.push(movie); 
    res.status(201).json(movie);
});

// PUT update a movie

app.put('/movies/:id', (req, res)=>{
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send('Movie not found');

    movie.title = req.body.title;
    movie.genre = req.body.genre;
    movie.year = req.body.year;

    res.json(movie);
})

app.delete('/movies/:id', (req, res)=>{
    const movieIndex = movies.findIndex(m => m.id === parseInt(req.params.id));
    if (movieIndex === -1) return res.status(404).send('Movie not found');

    const deletedMovie = movies.splice(movieIndex, 1);
    res.json(deletedMovie)
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port :${PORT}`)
})