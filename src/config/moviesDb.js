// in-memory database
const movies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genre: "Drama"
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
    genre: "Crime"
  },
  {
    id: 3,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genre: "Sci-Fi"
  }
];

exports.default = movies;



/**
 * 
 */

function greet(name) {
  return `hello, ${name}`;
}

console.log(greet('eric'));