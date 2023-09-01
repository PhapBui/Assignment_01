const express = require("express");

const movieController = require("../controllers/movie.js");

const router = express.Router();

// /admin/add-movie => GET
router.get("/movies", movieController.getMovies);
router.get("/movies/:category", movieController.getMoviesByCategory);

router.post("/movies/video", movieController.getMovieTrailerById);
router.post("/movies/search", movieController.getMovieByKeyword);

module.exports = router;
