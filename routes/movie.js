const express = require("express");

const movieController = require("../controllers/movie.js");

const router = express.Router();

// /api/movies => GET
router.get("/movies", movieController.getMovies);
router.get("/movies/:category", movieController.getMoviesByCategory);

// /api/movies => POST
router.post("/movies/video", movieController.getMovieTrailerById);
router.post("/movies/search", movieController.getMovieByKeyword);

module.exports = router;
