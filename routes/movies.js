express = require('express');
// import conn from '../database/db.js'

// in-memory database
const movies = [];

const router = express.Router();

//Get all movies
/**authenticated if not redirect to sign up */

export  default router.get('/', (req, res)=>{
    res.status(200).json(movies);
    console.log("get all movies and show them in the landing page")
});

// export default router;