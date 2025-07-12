// Middleware for simple validation
const validateMovie = (req, res, next) => {
    if (!req.body.title || !req.body.genre || !req.body.year) {
        return res.status(400).send('Title, genre, and year are required');
    }
    next();
}

module.exports = validateMovie;