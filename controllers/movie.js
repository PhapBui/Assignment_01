const { Movies, Genres, Videos, MediaType } = require("../models/movies.js");
const { paging } = require("../utils/paging.js");

//get all movies
// /api/movies
exports.getMovies = (req, res, next) => {
  Movies.all((movies) => {
    res.status(200).json(paging(movies));
  });
};

//get movies by category
// /api/movies/:category
exports.getMoviesByCategory = (req, res, next) => {
  const { category: param } = req.params;
  let { page, genre } = req.query;

  switch (param) {
    //Get movies by trending
    case "trending":
      Movies.all((movies) => {
        const moviesSorted = movies.sort((a, b) => b.popularity - a.popularity);
        res.status(200).json(paging(moviesSorted, page, 20));
      });
      return;

    //Get movies by top rate
    case "top-rate":
      Movies.all((movies) => {
        const moviesSorted = movies.sort(
          (a, b) => b.vote_average - a.vote_average
        );
        res.status(200).json(paging(moviesSorted, page, 20));
      });
      return;

    // Get movies by category
    case "discover":
      const respones = {};
      if (!genre) {
        res.status(400).json({ message: "Not found gerne parram" });
        return;
      }
      Genres.all(
        ((genre, geners) => {
          const finder = geners.find((gener) => gener.id === +genre);

          respones.genre_name = finder?.name;
        }).bind(null, +genre)
      );

      Movies.all((movies) => {
        const movidesFilter = movies.filter((movie) =>
          movie.genre_ids.includes(+genre)
        );
        if (movidesFilter.length <= 0) {
          res
            .status(400)
            .json({ message: "Not found that gerne id: " + genre });
          return;
        } else {
          res
            .status(200)
            .json({ ...respones, ...paging(movidesFilter, page, 20) });
        }
      });
      return;
    default:
      res.status(200).json({
        code: -1,
        message: "not found",
      });
      return;
  }
};

//post: movie trailer by id
// /api/movies/video?film_id=[id]
exports.getMovieTrailerById = (req, res, next) => {
  const { film_id } = req.body;

  // return nofound film Id
  if (!film_id) {
    res.status(400).json({ message: "Not found film_id parram" });
    return;
  }

  Videos.all((videosData) => {
    // get video data by film id
    const trailerData = videosData.find((video) => video.id === film_id);
    //filter videos
    if (trailerData) {
      const trailers = trailerData.videos
        .filter(
          (video) =>
            video.official &
            (video.site === "YouTube") &
            ((video.type === "Trailer") | (video.type === "Teaser"))
        )
        .sort(
          (b, a) =>
            new Date(a.published_at).getTime() -
            new Date(b.published_at).getTime()
        );

      const trailerVideo = trailers.find(
        (trailer) => trailer.type === "Trailer"
      );

      const teaserVideo = trailers.find((trailer) => trailer.type === "Teaser");

      if (trailerVideo) {
        res.status(200).json({ results: trailerVideo });
      } else {
        res.status(200).json({ results: teaserVideo });
      }
      // response not found
    } else {
      res.status(404).json({ message: "Not found video" });
    }
  });
};

//post search movies by keyword
// /api/movies/search?keyword=[keyword]
exports.getMovieByKeyword = (req, res, next) => {
  const {
    keyword,
    genre_id: genre_ids,
    mediaType: media_type,
    language: original_language,
    year: release_date,
  } = req.body;
  // make filter object
  const filter = { genre_ids, media_type, original_language, release_date };

  if (!keyword) {
    res.status(400).json({ message: "Keyword not found" });
  } else {
    Movies.all((movies) => {
      let moviesMatch = movies.filter(
        (movie) =>
          movie.title?.toLowerCase().includes(keyword.toLowerCase()) |
          movie.overview?.toLowerCase().includes(keyword.toLowerCase())
      );

      // 12(nâng cao) nâng cấp chức năng search
      //12.1- sử dụng nếu data đồng bộ (mỗi movieItem chỉ có release_date)

      let moviesMatch1 = moviesMatch.filter((item) => {
        for (let key in filter) {
          if (filter[key] === undefined) continue;
          if (
            (item[key] === undefined) |
            !item[key].includes(+filter[key] ? +filter[key] : filter[key])
          ) {
            return false;
          }
        }
        return true;
      });

      //12.2- sử dụng nếu data không đồng bộ (movieItem có thể có release_date hoặc first_air_date

      if (genre_ids) {
        moviesMatch = moviesMatch.filter((movie) =>
          movie.genre_ids?.includes(+genre_ids)
        );
      }
      if (media_type) {
        moviesMatch = moviesMatch.filter((movie) =>
          movie.media_type?.includes(media_type)
        );
      }
      if (original_language) {
        moviesMatch = moviesMatch.filter((movie) =>
          movie.original_language?.includes(original_language)
        );
      }
      if (release_date) {
        moviesMatch = moviesMatch.filter(
          (movie) =>
            movie.release_date?.includes(+release_date) ||
            movie.first_air_date?.includes(+release_date)
        );
      }

      res.status(200).json(paging(moviesMatch));
    });
  }
};

//get genre list
// /api/movies/genres
exports.getGenres = (req, res, next) => {
  Genres.all((genres) => {
    res.status(200).json(genres);
  });
};
//get media types
// /api/movies/media-types
exports.getMediaTypes = (req, res, next) => {
  MediaType.all((types) => {
    res.status(200).json(types);
  });
};
