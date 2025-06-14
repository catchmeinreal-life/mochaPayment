const express = require('express');

const router = express.Router();

// demo movies data
const movies = require('../config/moviesDb.js')

// controllers (validation)
const validateMovie = require('../controllers/moviesController.js');

router.get('/', (req, res) => {
    res.status(200).json({ data : movies.default})
})


// get a paticular movie by id
router.get('/:id', (req, res)=>{
    const movie = movies.default.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send('Movie not found');
    res.status(200).json(movie);
})

// POST a new movie
router.post('/', validateMovie, (req, res)=>{
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

router.put('/:id', (req, res)=>{
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send('Movie not found');

    movie.title = req.body.title;
    movie.genre = req.body.genre;
    movie.year = req.body.year;

    res.json(movie);
})

router.delete('/:id', (req, res)=>{
    const movieIndex = movies.findIndex(m => m.id === parseInt(req.params.id));
    if (movieIndex === -1) return res.status(404).send('Movie not found');

    const deletedMovie = movies.splice(movieIndex, 1);
    res.json(deletedMovie)
})


module.exports = router;